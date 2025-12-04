/**
 * Complete WhatsApp Integration Test
 * Tests both inbound and outbound messaging
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tara4u.com';
const TEST_NUMBER = process.argv[2] || 'whatsapp:+917976696076';

console.log('🧪 Complete WhatsApp Integration Test\n');
console.log('Base URL:', BASE_URL);
console.log('Test Number:', TEST_NUMBER);
console.log('─'.repeat(60));

async function testInboundWebhook() {
    console.log('\n1️⃣ Testing Inbound Webhook (User → TARA)...');

    try {
        const formData = new URLSearchParams();
        formData.append('From', TEST_NUMBER);
        formData.append('To', 'whatsapp:+14155238886');
        formData.append('Body', 'Hi TARA, this is a test!');
        formData.append('ProfileName', 'Test User');

        const response = await fetch(`${BASE_URL}/api/whatsapp/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);

        if (response.ok && text.includes('<Response>')) {
            console.log('✅ Inbound webhook working!');
            return true;
        } else {
            console.log('❌ Inbound webhook failed!');
            return false;
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

async function testOutboundMessage() {
    console.log('\n2️⃣ Testing Outbound Message (TARA → User)...');

    try {
        const response = await fetch(`${BASE_URL}/api/whatsapp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: TEST_NUMBER,
                message: '🎉 Test message from TARA! WhatsApp integration is working!'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok && data.success) {
            console.log('✅ Outbound message sent!');
            console.log('Message SID:', data.messageSid);
            return true;
        } else {
            console.log('❌ Outbound message failed!');
            return false;
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

async function testTemplateMessage() {
    console.log('\n3️⃣ Testing Template Message...');

    try {
        const response = await fetch(`${BASE_URL}/api/whatsapp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: TEST_NUMBER,
                contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
                variables: {
                    '1': '12/1',
                    '2': '3pm'
                }
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok && data.success) {
            console.log('✅ Template message sent!');
            return true;
        } else {
            console.log('⚠️ Template message failed (might need approval)');
            return false;
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

async function runAllTests() {
    const results = {
        inbound: await testInboundWebhook(),
        outbound: await testOutboundMessage(),
        template: await testTemplateMessage()
    };

    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 Test Results:');
    console.log('  Inbound (User → TARA):', results.inbound ? '✅ PASS' : '❌ FAIL');
    console.log('  Outbound (TARA → User):', results.outbound ? '✅ PASS' : '❌ FAIL');
    console.log('  Template Messages:', results.template ? '✅ PASS' : '⚠️ SKIP');

    console.log('\n📋 Next Steps:');
    if (!results.inbound) {
        console.log('  ❌ Configure Twilio webhook: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox');
        console.log('     URL: ' + BASE_URL + '/api/whatsapp/webhook');
    }
    if (!results.outbound) {
        console.log('  ❌ Check Twilio credentials in environment variables');
        console.log('  ❌ Make sure sandbox is joined: send "join occur-them" to +14155238886');
    }
    if (results.inbound && results.outbound) {
        console.log('  ✅ WhatsApp integration fully working!');
        console.log('  🎉 Users can now chat with TARA on WhatsApp!');
    }
}

runAllTests();
