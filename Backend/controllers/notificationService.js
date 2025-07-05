// In Backend/controller/notificationService.js

const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSmsNotification = async (toPhoneNumber, messageBody) => {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: toPhoneNumber
    });
    console.log(`SMS sent successfully! SID: ${message.sid}`);
    return { status: 'success', sid: message.sid };
  } catch (error) {
    console.error(`Failed to send SMS: ${error}`);
    return { status: 'error', reason: error.message };
  }
};

module.exports = { sendSmsNotification };