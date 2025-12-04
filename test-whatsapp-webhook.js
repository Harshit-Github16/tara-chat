/**
 * Test script for WhatsApp webhook
 * Run this after deploying to test if webhook is working
 * 
 * Usage: node test-whatsapp-webhook.js
 */

const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`
    : 'http://localhost:3000/api/whatsapp/webhook';

async function testWebhook() {
    console.log('🧪 Testing WhatsApp Webhook...');
    console.log('📍 URL:', WEBHOOK_URL);
    console.log('');

    try {
        // Test GET request (health check)
        console.log('1️⃣ Testing GET request (health check)...');
        const getResponse = await fetch(WEBHOOK_URL);
        const getData = await getResponse.json();
        console.log('✅ GET Response:', getData);
        console.log('');

        // Test POST request (simulated WhatsApp message)
        console.log('2️⃣ Testing POST request (simulated message)...');

        const formData = new URLSearchParams();
        formData.append('From', 'whatsapp:+919876543210');
        formData.append('To', 'whatsapp:+14155238886');
        formData.append('Body', 'Hi TARA, this is a test message');
        formData.append('ProfileName', 'Test User');

        const postResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        const postData = await postResponse.text();
        console.log('✅ POST Response:', postData);
        console.log('');

        console.log('🎉 Webhook test completed!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Configure this URL in Twilio WhatsApp Sandbox');
        console.log('2. Send a real message from WhatsApp');
        console.log('3. Check Vercel logs for any errors');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('');
        console.log('Troubleshooting:');
        console.log('1. Make sure your app is deployed');
        console.log('2. Check NEXT_PUBLIC_APP_URL in .env');
        console.log('3. Verify webhook route exists: app/api/whatsapp/webhook/route.js');
    }
}

// Run test
testWebhook();
