require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { generateGoogleCalendarLink, formatUserFriendlyDateTime, formatDuration } = require('../utils/googleCalendar');
// --- FIX #1: Import the asyncHandler package ---
const asyncHandler = require('express-async-handler');
const { extractTravelRequest } = require('./travelRequestController');
const flightSearchController = require('./flightSearchController');
const { searchHotels } = require('./hotelSearchController');
const { confirmFlight, bookFlight } = require('./flightBookingService');
const { sendSmsNotification } = require('./notificationService');
const User = require('../models/User');
const { confirmHotelOffer, bookHotel, getOffersForHotelId } = require('./hotelBookingService');
const { generateActivitySuggestions } = require('./activitySuggestionService');
const { amadeusActivityController, getActivitiesNearBookedHotel } = require('./amadeusActivityController');
const { generateFlightBookingSms, generateHotelBookingSms } = require('../utils/smsTemplates');
const neo4jService = require('../services/neo4jService');

// This controller will be responsible for coordinating other agents
// to build the complete itinerary.
const orchestrateFlightBooking = asyncHandler(async (req, res) => {
    const { text, travelers, paymentDetails } = req.body; // Expect 'travelers' array and paymentDetails from frontend

    if (!text) {
        return res.status(400).json({ message: 'User input text is required to generate an itinerary.' });
    }

    if (!travelers || !Array.isArray(travelers) || travelers.length === 0) {
        return res.status(400).json({ message: 'Traveler data (array of traveler objects) is required for booking.' });
    }

    // 1. Call Travel Request Agent
    let travelRequest;
    try {
        travelRequest = await extractTravelRequest({ body: { text: text } });
        console.log('Extracted Travel Request:', JSON.stringify(travelRequest, null, 2));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to process travel request.', details: error.message });
    }

    if (!travelRequest || !travelRequest.flight || !travelRequest.flight.origin || !travelRequest.flight.departureDate) {
        return res.status(400).json({ message: 'Could not extract valid flight details from your request. Please specify origin, destination, and dates.' });
    }

    // Validate that the number of travelers matches the extracted adults count
    if (travelers.length !== (travelRequest.flight.adults || 1)) {
        return res.status(400).json({ message: `Number of travelers provided (${travelers.length}) does not match the number of adults in the request (${travelRequest.flight.adults || 1}).` });
    }

    // Check for payment details if hotel booking is requested
    if (travelRequest.hotel && travelRequest.hotel.location && !paymentDetails) {
        return res.status(400).json({ message: 'Payment details are required for hotel booking.' });
    }

    // 2. Call Flight Search Agent
    const flightSearchParams = {
        origin: travelRequest.flight.origin,
        destination: travelRequest.flight.destination,
        departureDate: travelRequest.flight.departureDate,
        returnDate: travelRequest.flight.returnDate,
        adults: travelRequest.flight.adults || 1,
        travelClass: travelRequest.flight.travelClass
    };

    let bookingConfirmation = null;
    let flightBooked = false;
    let attempts = 0;
    const maxAttempts = 2;

    while (!flightBooked && attempts < maxAttempts) {
        attempts++;
        const flightSearchRes = {
            status: (statusCode) => {
                flightSearchRes.statusCode = statusCode;
                return flightSearchRes;
            },
            json: (data) => {
                flightSearchRes.body = data;
            }
        };

        await flightSearchController.searchFlights({ body: flightSearchParams }, flightSearchRes);
        
        // --- FIX #2: Add detailed error logging ---
        if (flightSearchRes.statusCode !== 200) {
            console.error("CRITICAL ERROR from flightSearchController:", JSON.stringify(flightSearchRes.body, null, 2));
            return res.status(500).json({ message: 'Failed to find flights.', details: flightSearchRes.body });
        }
        
        if (!flightSearchRes.body.flights || flightSearchRes.body.flights.length === 0) {
            return res.status(500).json({ message: 'No flights available for the given criteria.', details: flightSearchRes.body });
        }

        for (const flightOffer of flightSearchRes.body.flights) {
            try {
                const confirmedOffer = await confirmFlight(flightOffer);

                if (!confirmedOffer || !confirmedOffer.data || !confirmedOffer.data.flightOffers || confirmedOffer.data.flightOffers.length === 0) {
                    console.warn(`Orchestrator: No confirmable flight offers returned for flightOffer: ${flightOffer.id}. Trying next available flight.`);
                    continue; // Try next flight offer
                }

                const travelerIds = confirmedOffer.data.flightOffers[0].travelerPricings.map(tp => tp.travelerId);
                const travelersForBooking = travelers.map((frontendTraveler, index) => {
                    const amadeusTravelerId = travelerIds[index];
                    if (!amadeusTravelerId) {
                        throw new Error(`Missing Amadeus traveler ID for traveler at index ${index}.`);
                    }
                    return {
                        id: amadeusTravelerId,
                        dateOfBirth: frontendTraveler.dateOfBirth,
                        name: {
                            firstName: frontendTraveler.name.firstName,
                            lastName: frontendTraveler.name.lastName
                        },
                        gender: frontendTraveler.gender,
                        contact: frontendTraveler.contact,
                        documents: frontendTraveler.documents
                    };
                });

                bookingConfirmation = await bookFlight(confirmedOffer.data.flightOffers[0], travelersForBooking);
                flightBooked = true;

                // Update flight booking count in Neo4j
                await neo4jService.updateBookingCounts(req.user.id, 'flight');

                // Store implicit flight preferences in Neo4j
                const bookedFlightOffer = bookingConfirmation.data.flightOffers[0];
                if (bookedFlightOffer.itineraries && bookedFlightOffer.itineraries.length > 0) {
                    const firstSegment = bookedFlightOffer.itineraries[0].segments[0];
                    if (firstSegment.carrierCode) {
                        await neo4jService.addOrUpdatePreference(
                            req.user.id,
                            'PREFERS_AIRLINE',
                            'Airline', { name: firstSegment.carrierCode }
                        );
                    }
                    if (bookedFlightOffer.travelerPricings && bookedFlightOffer.travelerPricings.length > 0) {
                        const cabinClass = bookedFlightOffer.travelerPricings[0] ?.fareDetailsBySegment[0] ?.cabin;
                        if (cabinClass) {
                            await neo4jService.addOrUpdatePreference(
                                req.user.id,
                                'PREFERS_CLASS',
                                'FlightClass', { type: cabinClass }
                            );
                        }
                    }

                    // Update flight spend in Neo4j
                    const flightTotalPrice = parseFloat(bookedFlightOffer.price.grandTotal);
                    if (!isNaN(flightTotalPrice)) {
                        await neo4jService.updateUserSpend(req.user.id, 'flight', flightTotalPrice);
                    }
                }

                // Send SMS for flight booking to all travelers
                for (const traveler of travelers) {
                    const phoneNumber = `+${traveler?.contact?.phones[0]?.countryCallingCode}${traveler?.contact?.phones[0]?.number}`;
                    if (phoneNumber) {
                        const flightOffer = bookingConfirmation.data.flightOffers[0];
                        const flightCalendarLinks = [];
                        const isRoundTrip = flightOffer.itineraries.length > 1;

                        flightOffer.itineraries.forEach((itinerary, index) => {
                            const firstSegment = itinerary.segments[0];
                            const lastSegment = itinerary.segments[itinerary.segments.length - 1];

                            let flightTypePrefix = isRoundTrip ? (index === 0 ? 'Outbound ' : 'Return ') : '';
                            const title = `${flightTypePrefix}Flight: ${firstSegment.carrierCode}${firstSegment.number} ${firstSegment.departure.iataCode} to ${lastSegment.arrival.iataCode}`;

                            let description = `<b>Confirmation ID:</b> ${bookingConfirmation.data.id}\n<b>Airline:</b> ${firstSegment.carrierCode}\n<b>Flight:</b> ${firstSegment.number}\n`;
                            itinerary.segments.forEach((segment, segIndex) => {
                                description += `\n--- Segment ${segIndex + 1} ---\n  <b>Flight:</b> ${segment.carrierCode}${segment.number}\n  <b>Departs:</b> ${segment.departure.iataCode} Terminal ${segment.departure.terminal || ''} at ${formatUserFriendlyDateTime(segment.departure.at)}\n  <b>Arrives:</b> ${segment.arrival.iataCode} Terminal ${segment.arrival.terminal || ''} at ${formatUserFriendlyDateTime(segment.arrival.at)}\n`;
                            });

                            const location = `${firstSegment.departure.iataCode} Airport`;
                            const startTime = firstSegment.departure.at;
                            const endTime = lastSegment.arrival.at;

                            flightCalendarLinks.push(generateGoogleCalendarLink({
                                title,
                                description,
                                location,
                                startTime,
                                endTime,
                                reminders: 'P2H'
                            }));
                        });

                        const flightSmsMessage = generateFlightBookingSms(bookingConfirmation, traveler, flightCalendarLinks);
                        await sendSmsNotification(phoneNumber, flightSmsMessage);
                    }
                }
                break;
            } catch (error) {
                if (error.response && error.response.body) {
                    const errorBody = JSON.parse(error.response.body);
                    if (errorBody.errors && errorBody.errors[0].code === 34651) {
                        console.warn(`Segment sell failure for flight offer. Trying next available flight.`);
                        continue;
                    } else {
                        console.error('Error during flight booking attempt:', errorBody);
                    }
                } else {
                    console.error('Error during flight booking attempt:', error.message);
                }
            }
        }
        if (flightBooked) break;
    }

    if (!flightBooked) {
        return res.status(500).json({ message: 'Failed to book any flight after trying all available options.' });
    }

    if (travelRequest.hotel && travelRequest.hotel.location) {
        let hotelBooked = false;
        let hotelAttempts = 0;
        const maxHotelAttempts = 3;

        try {
            const hotelOffers = await searchHotels(flightSearchParams.destination, travelRequest.flight.adults, travelRequest.hotel.checkInDate, travelRequest.hotel.checkOutDate);

            if (!hotelOffers || hotelOffers.length === 0) {
                throw new Error("No hotel offers found.");
            }

            while (!hotelBooked && hotelAttempts < maxHotelAttempts && hotelAttempts < hotelOffers.length) {
                hotelAttempts++;
                try {
                    const selectedHotelOffer = hotelOffers[hotelAttempts - 1];
                    const confirmedOffer = await confirmHotelOffer(selectedHotelOffer.offers[0].id);

                    const guestsForBooking = travelers.map(traveler => ({
                        name: {
                            firstName: traveler.name.firstName,
                            lastName: traveler.name.lastName
                        },
                        contact: {
                            phone: traveler.contact.phones[0].number,
                            email: traveler.contact.emailAddress
                        }
                    }));

                    const hotelOrderData = {
                        type: "hotel-order",
                        guests: guestsForBooking.map((guest, index) => {
                            const originalTraveler = travelers[index];
                            return {
                                tid: index + 1,
                                title: originalTraveler.title,
                                firstName: guest.name.firstName,
                                lastName: guest.name.lastName,
                                phone: guest.contact.phone,
                                email: guest.contact.email
                            };
                        }),
                        travelAgent: {
                            contact: { email: "bob.smith@email.com" }
                        },
                        roomAssociations: [{
                            guestReferences: guestsForBooking.map((_, index) => ({
                                guestReference: (index + 1).toString()
                            })),
                            hotelOfferId: confirmedOffer.offers[0].id
                        }],
                        payment: paymentDetails
                    };

                    const hotelBookingConfirmation = await bookHotel(hotelOrderData);

                    bookingConfirmation.hotelBookingDetails = hotelBookingConfirmation;
                    console.log('Hotel Booking Confirmation:', JSON.stringify(hotelBookingConfirmation, null, 2));

                    const hotelBooking = hotelBookingConfirmation.hotelBookings[0];
                    const hotelDetails = hotelBooking.hotel;
                    const hotelOffer = hotelBooking.hotelOffer;
                    const checkInTime = hotelOffer.policies ?.checkInOut ?.checkIn || '00:00:00';
                    const checkOutTime = hotelOffer.policies ?.checkInOut ?.checkOut || '00:00:00';

                    const hotelTitle = `Hotel Booking: ${hotelDetails.name}`;
                    let hotelDescription = `<b>Confirmation ID:</b> ${hotelBooking.hotelProviderInformation[0].confirmationNumber}\n<b>Hotel:</b> ${hotelDetails.name}\n<b>Check-in:</b> ${hotelOffer.checkInDate}${checkInTime !== 'N/A' ? ' at ' + checkInTime : ''}\nCheck-out: ${hotelOffer.checkOutDate}${checkOutTime !== 'N/A' ? ' at ' + checkOutTime : ''}\nRoom Type: ${hotelOffer.room?.description?.text || 'N/A'}\nRoom Quantity: ${hotelOffer.roomQuantity || 'N/A'}\nGuests: ${hotelOffer.guests?.adults || 'N/A'} Adults\nTotal: ${hotelOffer.price.total} ${hotelOffer.price.currency}. Enjoy your stay!`;

                    const hotelCalendarLink = generateGoogleCalendarLink({
                        title: hotelTitle,
                        description: hotelDescription,
                        location: hotelDetails.name,
                        startTime: `${hotelOffer.checkInDate}T${checkInTime}`,
                        endTime: `${hotelOffer.checkOutDate}T${checkOutTime}`,
                        reminders: 'P1D'
                    });

                    for (const traveler of travelers) {
                        const phoneNumber = traveler ?.contact ?.phones[0] ?.number;
                        if (phoneNumber) {
                            const hotelSmsMessage = generateHotelBookingSms(hotelBookingConfirmation, traveler, hotelCalendarLink);
                            await sendSmsNotification(phoneNumber, hotelSmsMessage);
                        }
                    }

                    if (hotelBookingConfirmation ?.hotelBookings[0] ?.hotel ?.hotelId) {
                        try {
                            const hotelIdForActivities = hotelBookingConfirmation.hotelBookings[0].hotel.hotelId;
                            const nearbyActivities = await getActivitiesNearBookedHotel(hotelIdForActivities);
                            bookingConfirmation.nearby_activities = nearbyActivities;
                            console.log('Nearby Activities:', JSON.stringify(nearbyActivities, null, 2));
                        } catch (activityError) {
                            console.error('Error fetching nearby activities automatically:', activityError.message);
                            bookingConfirmation.nearby_activities = ["Could not retrieve nearby activities automatically."];
                        }
                    }
                    hotelBooked = true;
                    await neo4jService.updateBookingCounts(req.user.id, 'hotel');

                    const bookedHotelDetails = hotelBookingConfirmation.hotelBookings[0].hotel;
                    const bookedHotelOffer = hotelBookingConfirmation.hotelBookings[0].hotelOffer;

                    if (bookedHotelDetails.chainCode) {
                        await neo4jService.addOrUpdatePreference(req.user.id, 'PREFERS_HOTEL_CHAIN', 'HotelChain', { name: bookedHotelDetails.chainCode });
                    }
                    if (bookedHotelOffer.room ?.description ?.text) {
                        await neo4jService.addOrUpdatePreference(req.user.id, 'PREFERS_HOTEL_TYPE', 'HotelType', { name: bookedHotelOffer.room.description.text });
                    }
                    if (bookedHotelDetails.name) {
                        await neo4jService.addOrUpdatePreference(req.user.id, 'PREFERS_HOTEL_NAME', 'HotelName', { name: bookedHotelDetails.name });
                    }
                    if (bookedHotelOffer.roomQuantity) {
                        await neo4jService.addOrUpdatePreference(req.user.id, 'PREFERS_ROOM_QUANTITY', 'RoomQuantity', { quantity: bookedHotelOffer.roomQuantity });
                    }
                    const hotelTotalPrice = parseFloat(bookedHotelOffer.price.total);
                    if (!isNaN(hotelTotalPrice)) {
                        await neo4jService.updateUserSpend(req.user.id, 'hotel', hotelTotalPrice);
                    }
                } catch (hotelBookingError) {
                    console.error(`Hotel booking attempt ${hotelAttempts} failed:`, hotelBookingError.message);
                    if (hotelBookingError.message.includes("INVALID PREPAY") || hotelBookingError.message.includes("Amadeus Hotel Booking Error")) {
                        console.warn("Trying next available hotel offer...");
                    } else {
                        throw hotelBookingError;
                    }
                }
            }

            if (!hotelBooked) {
                bookingConfirmation.hotelInfo = "Failed to book any hotel after multiple attempts or no suitable offers found.";
            }

        } catch (hotelError) {
            console.error('Hotel booking process failed:', hotelError);
            bookingConfirmation.hotelInfo = `Could not complete the hotel booking: ${hotelError.message}`;
        }
    }

    try {
        let destinationForActivities = travelRequest.activities ?.location || flightSearchParams.destination;
        let userActivityPreferences = travelRequest.activities ?.userPreferences || [];

        const activityRecommendations = await generateActivitySuggestions(
            destinationForActivities,
            userActivityPreferences
        );
        bookingConfirmation.itinerary_suggestions = activityRecommendations.itinerarySuggestions;
        bookingConfirmation.tavilyRawResults = activityRecommendations.rawResults;
        bookingConfirmation.tavilySummary = activityRecommendations.summary;

    } catch (enrichmentError) {
        console.error('Error generating activity suggestions:', enrichmentError);
        bookingConfirmation.itinerary_suggestions = ["Could not retrieve activity suggestions at this time."];
    }

    res.status(200).json({
        message: 'Flight booking completed successfully through multi-agent orchestration!',
        bookingConfirmation: bookingConfirmation,
        originalTravelRequest: travelRequest
    });
});

module.exports = {
    orchestrateFlightBooking
};