# Twilio SMS Setup Guide

This document outlines the current Twilio SMS setup for development/testing and the steps required to configure it for production to enable actual SMS sending.

## 1. Current Development/Testing Setup

For development and testing purposes, Twilio SMS sending is **disabled by default**. This prevents actual SMS charges and ensures that messages are not sent during development.

**Key Configuration:**

*   **`.env` file (in `Backend/.env`):**
    ```env
    # Twilio Credentials (dummy values for development/testing)
    TWILIO_ACCOUNT_SID=Replace with your actual SID
    TWILIO_AUTH_TOKEN=your_auth_token_here
    TWILIO_PHONE_NUMBER= Replace with your actual Twilio phone

    # Disable actual SMS sending for development/testing
    DISABLE_SMS_NOTIFICATIONS=true
    ```
    *   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are present but can contain dummy values as long as `DISABLE_SMS_NOTIFICATIONS` is `true`.
    *   `DISABLE_SMS_NOTIFICATIONS=true` ensures that the `sendSmsNotification` function in `Backend/controllers/notificationService.js` will only log a message to the console instead of making an actual Twilio API call.

## 2. Production Setup for Actual SMS Sending

To enable actual SMS sending in a production environment, you need to perform the following steps:

### Step 2.1: Obtain Real Twilio Credentials

1.  **Create a Twilio Account:** If you don't have one, sign up at [twilio.com](https://www.twilio.com/).
2.  **Get Account SID and Auth Token:** Once logged in, your Account SID and Auth Token will be available on your Twilio Console dashboard.
3.  **Get a Twilio Phone Number:** Purchase an SMS-enabled phone number from Twilio. This will be your `TWILIO_PHONE_NUMBER`.

### Step 2.2: Configure Production Environment Variables

**Do NOT put your real Twilio credentials directly into your `.env` file in production.** Environment variables should be set directly on your hosting platform (e.g., Heroku, AWS, DigitalOcean, Vercel, Netlify, etc.).

1.  **Set `TWILIO_ACCOUNT_SID`:** Set this environment variable to your actual Twilio Account SID.
2.  **Set `TWILIO_AUTH_TOKEN`:** Set this environment variable to your actual Twilio Auth Token.
3.  **Set `TWILIO_PHONE_NUMBER`:** Set this environment variable to your actual Twilio phone number (e.g., `+1XXXXXXXXXX`).
4.  **Set `DISABLE_SMS_NOTIFICATIONS`:** Set this environment variable to `false`. This will instruct the application to make actual Twilio API calls.

**Example (Conceptual for a hosting platform):**

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Your real Twilio Account SID
TWILIO_AUTH_TOKEN=your_real_auth_token_here        # Your real Twilio Auth Token
TWILIO_PHONE_NUMBER=+1234567890                    # Your real Twilio Phone Number
DISABLE_SMS_NOTIFICATIONS=false                    # Enable actual SMS sending
```

### Step 2.3: Verify Functionality

After deploying with the production environment variables, perform a test booking (flight or hotel) to ensure that actual SMS messages are being sent to the provided phone numbers. Monitor your Twilio Console for message logs and delivery statuses.

## 3. Related Files

Here are the key files involved in the Twilio SMS integration:

*   **`Backend/controllers/notificationService.js`**:
    *   Contains the core `sendSmsNotification` function that interacts with the Twilio API.
    *   Handles the `DISABLE_SMS_NOTIFICATIONS` environment variable to prevent actual SMS sending in development.

*   **`Backend/utils/smsTemplates.js`**:
    *   Defines the `generateFlightBookingSms` and `generateHotelBookingSms` functions.
    *   These functions are responsible for formatting the booking details into human-readable SMS messages.
    *   **If SMS content needs to be changed, this is the file to modify.**

*   **`Backend/controllers/flightBookingOrchestrator.js`**:
    *   Integrates the SMS sending logic.
    *   Calls the `sendSmsNotification` function after successful flight and hotel bookings, using the templates from `smsTemplates.js`.

