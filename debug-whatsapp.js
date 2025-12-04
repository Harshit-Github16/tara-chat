/**
 * WhatsApp Integration Debug Script
 * Run: node debug-whatsapp.js YOUR_DOMAIN_URL
 */

const domain = process.argv[2] || 'http://localhost:3000';

console.log('🔍 WhatsApp Integration Debug\n');
console.log('Testing domain:', domain);
console.log('─'.repeat(50));

async function testWebhook() {
    const webhookUrl = `${domain}/api/whatsapp/webhook`;

    console.log('\n1️⃣ Testing Webhook Endpoint...');
    console.log('URL:', webhookUrl);

    try {
        // Test GET request
        console.log('\n📡 GET Request (Health Check)...');
        const getResponse = await fetch(webhookUrl);
        console.log('Status:', getResponse.status);

        if (getResponse.ok) {
            const data = await getResponse.json();
            console.log('✅ Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('❌ Failed:', getResponse.statusText);
            const text = await getResponse.text();
            console.log('Error:', text);
        }

        // Test POST request (simulate Twilio)
        console.log('\n📡 POST Request (Simulated WhatsApp Message)...');
        const formData = new URLSearchParams();
        formData.append('From', 'whatsapp:+919928005564');
        formData.append('To', 'whatsapp:+14155238886');
        formData.append('Body', 'Test message');
        formData.append('ProfileName', 'Test User');

        const postResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        console.log('Status:', postResponse.status);
        const postText = await postResponse.text();
        console.log('Response:', postText);

        if (postResponse.ok) {
            console.log('✅ Webhook is working!');
        } else {
            console.log('❌ Webhook failed!');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

async function checkEnvironment() {
    console.log('\n2️⃣ Checking Environment Variables...');

    const required = [
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_WHATSAPP_NUMBER',
        'MONGODB_URI',
        'GROQ_API_KEY'
    ];

    console.log('\nRequired variables:');
    required.forEach(key => {
        const value = process.env[key];
        if (value) {
            console.log(`✅ ${key}: ${value.substring(0, 10)}...`);
        } else {
            console.log(`❌ ${key}: NOT SET`);
        }
    });
}

async function testChatAPI() {
    console.log('\n3️⃣ Testing Chat API...');
    const chatUrl = `${domain}/api/chat`;

    try {
        const response = await fetch(chatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'test-user-123',
                chatUserId: 'tara-ai',
                message: 'Hi TARA',
                userDetails: {
                    name: 'Test User'
                }
            })
        });

        console.log('Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Chat API working!');
            console.log('TARA Reply:', data.aiMessage?.content);
        } else {
            console.log('❌ Chat API failed!');
            const text = await response.text();
            console.log('Error:', text);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

async function runAllTests() {
    await testWebhook();
    await checkEnvironment();
    await testChatAPI();

    console.log('\n' + '─'.repeat(50));
    console.log('\n📋 Next Steps:');
    console.log('1. Fix any ❌ errors shown above');
    console.log('2. Configure Twilio webhook URL:');
    console.log(`   ${domain}/api/whatsapp/webhook`);
    console.log('3. Make sure all environment variables are set in production');
    console.log('4. Test by sending WhatsApp message to +14155238886');
    console.log('\n💡 Twilio Webhook Settings:');
    console.log('   https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox');
}

runAllTests();
