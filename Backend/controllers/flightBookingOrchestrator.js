require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const asyncHandler = require('express-async-handler');
const { extractTravelRequest } = require('./travelRequestController');
const flightSearchController = require('./flightSearchController');
const { searchHotels } = require('./hotelSearchController');
const { confirmFlight, bookFlight } = require('./flightBookingService');
const { sendSmsNotification } = require('./notificationService');
const User = require('../models/User');
const { confirmHotelOffer, bookHotel } = require('./hotelBookingService');
const { generateActivitySuggestions } = require('./activitySuggestionService'); // Import the new service
const { amadeusActivityController, getActivitiesNearBookedHotel } = require('./amadeusActivityController');
const { generateFlightBookingSms, generateHotelBookingSms } = require('../utils/smsTemplates');

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

    if (!travelRequest || !travelRequest.flight) {
        return res.status(400).json({ message: 'Could not extract valid flight details from your request.' });
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
        adults: travelRequest.flight.adults || 1 // Default to 1 adult if not specified
    };

    let bookingConfirmation = null;
    let flightBooked = false;
    let attempts = 0;
    const maxAttempts = 2;

    while (!flightBooked && attempts < maxAttempts) {
        attempts++;
        const flightSearchRes = {};
        flightSearchRes.status = (statusCode) => { flightSearchRes.statusCode = statusCode; return flightSearchRes; };
        flightSearchRes.json = (data) => { flightSearchRes.body = data; };

        await flightSearchController.searchFlights({ body: flightSearchParams }, flightSearchRes);

        if (flightSearchRes.statusCode !== 200 || !flightSearchRes.body.flights || flightSearchRes.body.flights.length === 0) {
            return res.status(500).json({ message: 'Failed to find flights or no flights available.', details: flightSearchRes.body });
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
                // console.log('Flight Booking Confirmation:', JSON.stringify(bookingConfirmation, null, 2)); // Temporarily commented out for focused logging
                // --- New Logic: Save a record of this booking ---
                const airlineCode = bookingConfirmation.data.validatingAirlineCodes[0];
                const partner = await Partner.findOne({ businessName: airlineCode });

                await Booking.create({
                    user: req.user.id,
                    bookingType: 'flight',
                    providerName: airlineCode,
                    partner: partner ? partner._id : null,
                    amount: parseFloat(bookingConfirmation.data.price.grandTotal)
                });

                // Send SMS for flight booking to all travelers
                for (const traveler of travelers) {
                    const phoneNumber = traveler?.contact?.phones[0]?.number;
                    if (phoneNumber) {
                        const flightSmsMessage = generateFlightBookingSms(bookingConfirmation, traveler);
                        await sendSmsNotification(phoneNumber, flightSmsMessage);
                    }
                }
                break; // Exit loop on successful booking
            } catch (error) {
                if (error.response && error.response.body) {
                    const errorBody = JSON.parse(error.response.body);
                    if (errorBody.errors && errorBody.errors[0].code === 34651) {
                        console.warn(`Segment sell failure for flight offer. Trying next available flight.`);
                        continue; // Try next flight offer
                    } else {
                        // For other errors, fail fast
                        console.error('Error during flight booking attempt:', errorBody);
                    }
                } else {
                    // For other errors, fail fast
                    console.error('Error during flight booking attempt:', error.message);
                }
            }
        }
        if (flightBooked) break;
    }

    if (!flightBooked) {
        return res.status(500).json({ message: 'Failed to book any flight after trying all available options.' });
    }
    
    // I added this Call Hotel Search Agent (if hotel details are in the request) and book hotel logic
    if (travelRequest.hotel && travelRequest.hotel.location) {
        let hotelBooked = false;
        let hotelAttempts = 0;
        const maxHotelAttempts = 3; // Max attempts for hotel booking

        try {
            // Step 1: Search for hotels (existing logic)
            const hotelOffers = await searchHotels(flightSearchParams.destination, travelRequest.flight.adults, travelRequest.hotel.checkInDate, travelRequest.hotel.checkOutDate);

            if (!hotelOffers || hotelOffers.length === 0) {
                throw new Error("No hotel offers found.");
            }

            while (!hotelBooked && hotelAttempts < maxHotelAttempts && hotelAttempts < hotelOffers.length) {
                hotelAttempts++;
                try {
                    // Step 2: Select an offer and confirm it
                    const selectedHotelOffer = hotelOffers[hotelAttempts - 1]; // Try next available offer
                    const confirmedOffer = await confirmHotelOffer(selectedHotelOffer.offers[0].id);

                    // Step 3: Prepare guest info from the travelers array
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
                            contact: {
                                email: "bob.smith@email.com"
                            }
                        },
                        roomAssociations: [
                            {
                                guestReferences: guestsForBooking.map((_, index) => ({
                                    guestReference: (index + 1).toString()
                                })),
                                hotelOfferId: confirmedOffer.offers[0].id
                            }
                        ],
                        payment: paymentDetails
                    };

                    const hotelBookingConfirmation = await bookHotel(hotelOrderData);

                    // --- New Logic: Save a record of this hotel booking ---
                    const hotelName = confirmedOffer.hotel.name; // Get the hotel name
                    const partner = await Partner.findOne({ businessName: hotelName });

                    await Booking.create({
                        user: req.user.id,
                        bookingType: 'hotel',
                        providerName: hotelName,
                        partner: partner ? partner._id : null,
                        amount: parseFloat(confirmedOffer.offers[0].price.total)
                    });

                    // Add the successful booking info to the final response
                    bookingConfirmation.hotelBookingDetails = hotelBookingConfirmation;
                    console.log('Hotel Booking Confirmation:', JSON.stringify(hotelBookingConfirmation, null, 2));

                    // Send SMS for hotel booking to all travelers
                    for (const traveler of travelers) {
                        const phoneNumber = traveler?.contact?.phones[0]?.number;
                        if (phoneNumber) {
                            const hotelSmsMessage = generateHotelBookingSms(hotelBookingConfirmation, traveler);
                            await sendSmsNotification(phoneNumber, hotelSmsMessage);
                        }
                    }

                    // Automatically fetch nearby activities for the booked hotel
                    if (hotelBookingConfirmation && hotelBookingConfirmation.hotelBookings && hotelBookingConfirmation.hotelBookings.length > 0 && hotelBookingConfirmation.hotelBookings[0].hotel && hotelBookingConfirmation.hotelBookings[0].hotel.hotelId) {
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
                } catch (hotelBookingError) {
                    console.error(`Hotel booking attempt ${hotelAttempts} failed:`, hotelBookingError.message);
                    if (hotelBookingError.message.includes("INVALID PREPAY") || hotelBookingError.message.includes("Amadeus Hotel Booking Error")) {
                        console.warn("Retrying hotel booking with next available offer...");
                        // Continue to next iteration to try another offer
                    } else {
                        // For other unexpected errors, re-throw or handle as non-recoverable
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

    // --- START: Tavily Itinerary Enrichment Logic ---
    try {
        let destinationForActivities = travelRequest.activities?.location || flightSearchParams.destination;
        let userActivityPreferences = travelRequest.activities?.userPreferences || [];

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
    // --- END: Tavily Itinerary Enrichment Logic ---

    // 6. Return the final result
    res.status(200).json({
        message: 'Flight booking completed successfully through multi-agent orchestration!',
        bookingConfirmation: bookingConfirmation,
        originalTravelRequest: travelRequest
    });
});

module.exports = {
    orchestrateFlightBooking
};