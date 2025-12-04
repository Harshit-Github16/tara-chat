// Twilio client configuration
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !whatsappNumber) {
    console.warn('⚠️ Twilio credentials not configured. WhatsApp features will be disabled.');
}

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Send WhatsApp message to user
 * @param {string} to - User's WhatsApp number (format: whatsapp:+919876543210)
 * @param {string} message - Message text to send
 * @returns {Promise<object>} - Twilio message response
 */
export async function sendWhatsAppMessage(to, message) {
    if (!twilioClient) {
        throw new Error('Twilio client not initialized. Check environment variables.');
    }

    try {
        const response = await twilioClient.messages.create({
            from: whatsappNumber,
            to: to,
            body: message
        });

        console.log('✅ WhatsApp message sent:', response.sid);
        return response;
    } catch (error) {
        console.error('❌ Failed to send WhatsApp message:', error);
        throw error;
    }
}

/**
 * Send WhatsApp message with template (for approved templates)
 * @param {string} to - User's WhatsApp number
 * @param {string} contentSid - Twilio content template SID
 * @param {object} variables - Template variables
 * @returns {Promise<object>} - Twilio message response
 */
export async function sendWhatsAppTemplate(to, contentSid, variables = {}) {
    if (!twilioClient) {
        throw new Error('Twilio client not initialized. Check environment variables.');
    }

    try {
        const response = await twilioClient.messages.create({
            from: whatsappNumber,
            to: to,
            contentSid: contentSid,
            contentVariables: JSON.stringify(variables)
        });

        console.log('✅ WhatsApp template sent:', response.sid);
        return response;
    } catch (error) {
        console.error('❌ Failed to send WhatsApp template:', error);
        throw error;
    }
}

export default twilioClient;
