// In Backend/controllers/calendarService.js

const { google, outlook, yahoo } = require('calendar-link');

const generateCalendarLinks = (eventDetails) => {
  // The eventDetails object should have title, start, end, description, etc.
  const event = {
    title: eventDetails.title,
    start: eventDetails.startTime, // Must be in a format like '2025-07-15 09:00:00'
    end: eventDetails.endTime,
    description: eventDetails.description,
    location: eventDetails.location,
  };

  // Generate links for major calendar providers
  const links = {
    google: google(event),
    outlook: outlook(event),
    yahoo: yahoo(event),
  };

  return links;
};

module.exports = { generateCalendarLinks };