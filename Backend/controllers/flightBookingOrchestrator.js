const asyncHandler = require('express-async-handler');
const { extractTravelRequest } = require('./travelRequestController');
const flightSearchController = require('./flightSearchController');
const { searchHotels } = require('./hotelSearchController'); //I added this import to use the hotel search functionality
const { getRichLocationDetails } = require('./travelEnrichmentService'); // I added this import to use the travel enrichment service
const { confirmFlight, bookFlight } = require('./flightBookingService');
const { sendSmsNotification } = require('./notificationService'); // 1. ADD THIS LINE TO IMPORT THE SMS NOTIFICATION SERVICE
const User = require('../models/User'); // 1. ADD THIS LINE TO IMPORT THE USER MODEL
const { confirmHotelOffer, bookHotel } = require('./hotelBookingService'); // I added this import to use the hotel booking functionality

// This controller will be responsible for coordinating other agents
// to build the complete itinerary.
const orchestrateFlightBooking = asyncHandler(async (req, res) => {
    const { text, travelers } = req.body; // Expect 'travelers' array from frontend

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
    } catch (error) {
        console.error('Error in Travel Request Agent:', error.message);
        return res.status(500).json({ message: 'Failed to process travel request.', details: error.message });
    }

    if (!travelRequest || !travelRequest.flight) {
        return res.status(400).json({ message: 'Could not extract valid flight details from your request.' });
    }

    // Validate that the number of travelers matches the extracted adults count
    if (travelers.length !== (travelRequest.flight.adults || 1)) {
        return res.status(400).json({ message: `Number of travelers provided (${travelers.length}) does not match the number of adults in the request (${travelRequest.flight.adults || 1}).` });
    }

    // 2. Call Flight Search Agent
    const flightSearchParams = {
        origin: travelRequest.flight.origin,
        destination: travelRequest.flight.destination,
        departureDate: travelRequest.flight.departureDate,
        returnDate: travelRequest.flight.returnDate,
        adults: travelRequest.flight.adults || 1 // Default to 1 adult if not specified
    };

    // Mocking req and res for internal controller call
    const flightSearchRes = {};
    flightSearchRes.status = (statusCode) => { flightSearchRes.statusCode = statusCode; return flightSearchRes; };
    flightSearchRes.json = (data) => { flightSearchRes.body = data; };

    await flightSearchController.searchFlights({ body: flightSearchParams }, flightSearchRes);

    if (flightSearchRes.statusCode !== 200 || !flightSearchRes.body.flights || flightSearchRes.body.flights.length === 0) {
        return res.status(500).json({ message: 'Failed to find flights or no flights available.', details: flightSearchRes.body });
    }

    const selectedFlightOffer = flightSearchRes.body.flights[0]; // Select the first flight offer

    // Extract only the necessary fields for the Amadeus Flight Offers Price API
    const simplifiedFlightOffer = {
        type: selectedFlightOffer.type,
        id: selectedFlightOffer.id,
        source: selectedFlightOffer.source,
        instantTicketingRequired: selectedFlightOffer.instantTicketingRequired,
        nonHomogeneous: selectedFlightOffer.nonHomogeneous,
        oneWay: selectedFlightOffer.oneWay,
        lastTicketingDate: selectedFlightOffer.lastTicketingDate,
        numberOfBookableSeats: selectedFlightOffer.numberOfBookableSeats,
        itineraries: selectedFlightOffer.itineraries,
        price: selectedFlightOffer.price,
        pricingOptions: selectedFlightOffer.pricingOptions,
        validatingAirlineCodes: selectedFlightOffer.validatingAirlineCodes,
        travelerPricings: selectedFlightOffer.travelerPricings
    };

    // 3. Call Flight Booking Agent (Confirm)
    let confirmedFlightOffer;
    try {
        const confirmResult = await confirmFlight(simplifiedFlightOffer);
        if (!confirmResult || !confirmResult.data || !confirmResult.data.flightOffers || confirmResult.data.flightOffers.length === 0) {
            throw new Error('No confirmed flight offers returned.');
        }
        confirmedFlightOffer = confirmResult.data.flightOffers[0];
    } catch (error) {
        console.error('Error confirming flight:', error.message);
        return res.status(500).json({ message: 'Failed to confirm flight price.', details: error.message });
    }

    // 4. Call Flight Booking Agent (Book)
    let bookingConfirmation;
    try {
        // Extract traveler IDs from the confirmed flight offer
        const travelerIds = confirmedFlightOffer.travelerPricings.map(tp => tp.travelerId);

        // Map frontend traveler data to Amadeus traveler IDs
        const travelersForBooking = travelers.map((frontendTraveler, index) => {
            const amadeusTravelerId = travelerIds[index]; // Assuming order matches
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

        bookingConfirmation = await bookFlight(confirmedFlightOffer, travelersForBooking);

        // =================================================================
        // ===== START: NEW SMART SMS NOTIFICATION LOGIC =====================
        // =================================================================
        
        const user = await User.findById(req.user.id);

        if (user && user.phoneNumber) {
            // If the user has a phone number, send the SMS
            const message = `Your flight booking is confirmed! Your record locator is ${bookingConfirmation.data.associatedRecords[0].reference}.`;
            await sendSmsNotification(user.phoneNumber, message);
        } else {
            // If not, add a helpful note to the confirmation response
            bookingConfirmation.additional_info = "To get SMS alerts for your bookings, add your phone number in your profile settings!";
        }
        
        // =================================================================
        // ===== END: NEW SMART SMS NOTIFICATION LOGIC =======================
        // =================================================================

    } catch (error) {
        console.error('Error booking flight:', error.message);
        let errorMessage = 'Failed to book flight.';

        if (error.response && error.response.body && error.response.body.errors && error.response.body.errors.length > 0) {
            const amadeusError = error.response.body.errors[0];
            if (amadeusError.code === 34651 && amadeusError.title === "SEGMENT SELL FAILURE") {
                errorMessage = 'The selected flight or a segment of it is no longer available for booking. This might be due to a change in price or seat availability. Please try searching for flights again.';
            } else {
                errorMessage = `Amadeus API Error (Book Flight): ${error.response.statusCode} - ${JSON.stringify(JSON.parse(error.response.body))}`;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        return res.status(500).json({ message: errorMessage, details: error.message });
    }
    
    // I added this Call Hotel Search Agent (if hotel details are in the request) and book hotel logic
    if (travelRequest.hotel && travelRequest.hotel.location) {
    try {
        // Step 1: Search for hotels (existing logic)
        const hotelOffers = await searchHotels(travelRequest.hotel.location);

        if (!hotelOffers || hotelOffers.length === 0) {
            throw new Error("No hotel offers found.");
        }

        // Step 2: Select the best offer and confirm it
        const selectedHotelOfferId = hotelOffers[0].offers[0].id; // Select the first offer of the first hotel
        const confirmedOffer = await confirmHotelOffer(selectedHotelOfferId);

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

        // Step 4: Book the hotel
        const hotelBookingConfirmation = await bookHotel(confirmedOffer.data.offerId, guestsForBooking);

        // Add the successful booking info to the final response
        bookingConfirmation.hotelBookingDetails = hotelBookingConfirmation;

        } catch (hotelError) {
            console.error('Hotel booking process failed:', hotelError.message);
            bookingConfirmation.hotelInfo = "Could not complete the hotel booking.";
        }
  
    // --- START: New Tavily Itinerary Enrichment Logic ---
    try {
        const query = `What are the top 3 recommended things to do in ${travelRequest.hotel.location}?`;
        const enrichmentDetails = await getRichLocationDetails(query);
    
        // Add the answer from Tavily to our final response
        bookingConfirmation.itinerary_suggestions = enrichmentDetails.answer;
    
    } catch (enrichmentError) {
        console.error('Itinerary enrichment failed:', enrichmentError.message);
        bookingConfirmation.itinerary_suggestions = "Could not retrieve activity suggestions at this time.";
    }
    // --- END: New Tavily Itinerary Enrichment Logic ---
    }

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