// Backend/utils/smsTemplates.js

const generateFlightBookingSms = (bookingConfirmation, traveler) => {
    try {
        const flightOrder = bookingConfirmation.data;
        const flightOffer = flightOrder.flightOffers[0];
        const confirmationRef = flightOrder.associatedRecords[0].reference;

        let flightDetails = `Flight Confirmed! Booking ID: ${confirmationRef}.\n` +
                            `Booking Status: CONFIRMED\n` +
                            `Passenger: ${traveler.name.firstName} ${traveler.name.lastName}\n` +
                            `\n--- Flight Details ---` + `\n`;

        flightOffer.itineraries.forEach((itinerary, index) => {
            const itineraryType = flightOffer.itineraries.length > 1 ? (index === 0 ? 'Outbound' : 'Return') : 'Flight';
            flightDetails += `\n${itineraryType}:\n`;

            itinerary.segments.forEach((segment, segIndex) => {
                const departureTime = new Date(segment.departure.at).toLocaleString();
                const arrivalTime = new Date(segment.arrival.at).toLocaleString();
                const cabinClass = flightOffer.travelerPricings[0]?.fareDetailsBySegment[segIndex]?.cabin || segment.co2Emissions[0]?.cabin || 'N/A';
                const bookingClass = flightOffer.travelerPricings[0]?.fareDetailsBySegment[segIndex]?.class || 'N/A';

                flightDetails += `  ${segment.carrierCode}${segment.number} (${cabinClass} ${bookingClass})\n` +
                                 `  Departs: ${segment.departure.iataCode} (T${segment.departure.terminal || 'N/A'}) at ${departureTime}\n` +
                                 `  Arrives: ${segment.arrival.iataCode} (T${segment.arrival.terminal || 'N/A'}) at ${arrivalTime}\n`;
            });
        });

        flightDetails += `\nTotal Price: ${flightOffer.price.grandTotal} ${flightOffer.price.currency}.\nSafe travels!`;

        return flightDetails;
    } catch (error) {
        console.error('Error generating flight SMS:', error.message);
        return "Your flight booking is confirmed. Please check your booking details in the app.";
    }
};

const generateHotelBookingSms = (hotelBookingConfirmation, traveler) => {
    try {
        const hotelBooking = hotelBookingConfirmation.hotelBookings[0];
        const hotelOffer = hotelBooking.hotelOffer;
        const hotelDetails = hotelBooking.hotel;
        const confirmationNumber = hotelBooking.hotelProviderInformation[0].confirmationNumber;

        let hotelSms = `Hotel Confirmed! Booking ID: ${confirmationNumber}.\n` +
                       `Booking Status: ${hotelBooking.bookingStatus || 'CONFIRMED'}\n` +
                       `Guest: ${traveler.name.firstName} ${traveler.name.lastName}\n` +
                       `\n--- Hotel Details ---\n` +
                       `Hotel: ${hotelDetails.name}\n`;

        const address = hotelDetails.address?.lines?.join(', ');
        if (address && address !== 'N/A') {
            hotelSms += `Address: ${address}, ${hotelDetails.address?.cityName || 'N/A'}, ${hotelDetails.address?.postalCode || 'N/A'}\n`;
        }

        const checkInTime = hotelOffer.policies?.checkInOut?.checkIn;
        const checkOutTime = hotelOffer.policies?.checkInOut?.checkOut;

        hotelSms += `Check-in: ${hotelOffer.checkInDate}${checkInTime && checkInTime !== 'N/A' ? ' at ' + checkInTime : ''}\n` +
                    `Check-out: ${hotelOffer.checkOutDate}${checkOutTime && checkOutTime !== 'N/A' ? ' at ' + checkOutTime : ''}\n` +
                    `Room Type: ${hotelOffer.room?.description?.text || 'N/A'}\n` +
                    `Room Quantity: ${hotelOffer.roomQuantity || 'N/A'}\n` +
                    `Guests: ${hotelOffer.guests?.adults || 'N/A'} Adults\n` +
                    `Total: ${hotelOffer.price.total} ${hotelOffer.price.currency}. Enjoy your stay!`;

        return hotelSms;
    } catch (error) {
        console.error('Error generating hotel SMS:', error.message);
        return "Your hotel booking is confirmed. Please check your booking details in the app.";
    }
};

module.exports = { generateFlightBookingSms, generateHotelBookingSms };