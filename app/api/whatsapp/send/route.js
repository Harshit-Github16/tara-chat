import { NextResponse } from 'next/server';
import { sendWhatsAppMessage, sendWhatsAppTemplate } from '../../../../lib/twilio';

/**
 * API to send outbound WhatsApp messages
 * POST /api/whatsapp/send
 * 
 * Body:
 * {
 *   "to": "whatsapp:+919876543210",
 *   "message": "Hello from TARA!"
 * }
 * 
 * OR for templates:
 * {
 *   "to": "whatsapp:+919876543210",
 *   "contentSid": "HXb5b62575e6e4ff6129ad7c8efe1f983e",
 *   "variables": {"1": "12/1", "2": "3pm"}
 * }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { to, message, contentSid, variables } = body;

        // Validate required fields
        if (!to) {
            return NextResponse.json({
                error: 'Missing required field: to'
            }, { status: 400 });
        }

        // Validate WhatsApp number format
        if (!to.startsWith('whatsapp:+')) {
            return NextResponse.json({
                error: 'Invalid WhatsApp number format. Use: whatsapp:+919876543210'
            }, { status: 400 });
        }

        let response;

        // Send template message if contentSid provided
        if (contentSid) {
            response = await sendWhatsAppTemplate(to, contentSid, variables || {});
        }
        // Send regular text message
        else if (message) {
            response = await sendWhatsAppMessage(to, message);
        }
        // No message content provided
        else {
            return NextResponse.json({
                error: 'Either message or contentSid is required'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            messageSid: response.sid,
            status: response.status,
            to: response.to,
            from: response.from
        });

    } catch (error) {
        console.error('Send WhatsApp Message Error:', error);
        return NextResponse.json({
            error: 'Failed to send WhatsApp message',
            details: error.message
        }, { status: 500 });
    }
}

// GET endpoint for testing
export async function GET(request) {
    return NextResponse.json({
        status: 'WhatsApp send API is active',
        usage: {
            method: 'POST',
            endpoint: '/api/whatsapp/send',
            body: {
                to: 'whatsapp:+919876543210',
                message: 'Your message here'
            },
            example_template: {
                to: 'whatsapp:+919876543210',
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
                variables: { '1': '12/1', '2': '3pm' }
            }
        }
    });
}
