// Backend/utils/googleCalendar.js

/**
 * Formats an ISO date string into a user-friendly date and time string.
 * @param {string} isoString - The ISO date string (e.g., '2025-12-25T10:00:00').
 * @returns {string} Formatted date and time string (e.g., 'Dec 25, 2025 10:00 AM').
 */
const formatUserFriendlyDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
};

/**
 * Generates a Google Calendar event URL.
 * @param {object} eventDetails - Object containing event details.
 * @param {string} eventDetails.title - Title of the event.
 * @param {string} eventDetails.description - Description of the event.
 * @param {string} eventDetails.location - Location of the event (e.g., airport code, hotel address).
 * @param {string} eventDetails.startTime - Start date/time in ISO format (e.g., '2025-12-25T10:00:00').
 * @param {string} eventDetails.endTime - End date/time in ISO format (e.g., '2025-12-25T12:00:00').
 * @param {string} [eventDetails.reminders] - Optional. Reminder string (e.g., 'P2H' for 2 hours before, 'P30M' for 30 minutes before).
 * @returns {string} Google Calendar event URL.
 */
const generateGoogleCalendarLink = (eventDetails) => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams();

    // Google Calendar expects dates in YYYYMMDDTHHMMSS format
    const formatCalendarDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Ensure two digits for month, day, hour, minute, second
        const pad = (num) => num < 10 ? '0' + num : num;
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    };

    params.append('text', eventDetails.title);
    // REMOVING encodeURIComponent for details - Google Calendar seems to be double-encoding or not decoding
    params.append('details', eventDetails.description);
    // Simplifying location to just the IATA code
    params.append('location', eventDetails.location);

    params.append('dates', `${formatCalendarDateTime(eventDetails.startTime)}/${formatCalendarDateTime(eventDetails.endTime)}`);

    if (eventDetails.reminders) {
        params.append('rem', eventDetails.reminders);
    }

    return `${baseUrl}&${params.toString()}`;
};

/**
 * Formats an ISO 8601 duration string (e.g., "PT6H25M") into a human-readable format.
 * @param {string} isoDuration - The ISO 8601 duration string.
 * @returns {string} Human-readable duration (e.g., "6 hours 25 minutes").
 */
const formatDuration = (isoDuration) => {
    if (!isoDuration) return 'N/A';

    // Regex to capture hours and minutes from PTnHnM format
    const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

    if (!matches) {
        // If the simple PTnHnM format doesn't match, try to handle days
        const dayMatches = isoDuration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/);
        if (!dayMatches) return 'N/A'; // If no match at all, return N/A

        const days = parseInt(dayMatches[1] || '0', 10);
        const hours = parseInt(dayMatches[2] || '0', 10);
        const minutes = parseInt(dayMatches[3] || '0', 10);

        let result = [];
        if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

        return result.length > 0 ? result.join(' ') : 'Less than a minute';

    }

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);

    let result = [];
    if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

    return result.length > 0 ? result.join(' ') : 'Less than a minute';
};

module.exports = {
    generateGoogleCalendarLink,
    formatUserFriendlyDateTime,
    formatDuration // Export the new helper function
};