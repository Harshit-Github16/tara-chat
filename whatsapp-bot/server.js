/**
 * Free WhatsApp Bot using whatsapp-web.js
 * Works with your personal WhatsApp number
 * 
 * ⚠️ WARNING: This is unofficial and against WhatsApp ToS
 * Use at your own risk!
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const https = require('https');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Generate QR code for authentication
client.on('qr', (qr) => {
    console.log('📱 Scan this QR code with your WhatsApp:');
    qrcode.generate(qr, { small: true });
    console.log('\n👆 Open WhatsApp → Settings → Linked Devices → Link a Device');
});

// Client is ready
client.on('ready', () => {
    console.log('✅ WhatsApp Bot is ready!');
    console.log('📞 Your number is now connected to TARA');
    console.log('💬 Anyone can message you and TARA will reply!');
});

// Handle incoming messages
client.on('message', async (message) => {
    try {
        console.log(`\n📨 Message from ${message.from}:`);
        console.log(`   "${message.body}"`);

        // Ignore group messages (optional)
        const chat = await message.getChat();
        if (chat.isGroup) {
            console.log('   ⏭️  Skipping group message');
            return;
        }

        // Ignore own messages
        if (message.fromMe) {
            console.log('   ⏭️  Skipping own message');
            return;
        }

        // Show typing indicator
        chat.sendStateTyping();

        // Call TARA API
        const taraReply = await getTaraResponse(message.body, message.from);

        // Send reply
        await message.reply(taraReply);
        console.log(`   ✅ TARA replied: "${taraReply}"`);

    } catch (error) {
        console.error('❌ Error handling message:', error);
        await message.reply('Sorry, I encountered an error. Please try again.');
    }
});

// Get response from TARA
async function getTaraResponse(userMessage, phoneNumber) {
    return new Promise((resolve) => {
        try {
            const postData = JSON.stringify({
                userId: phoneNumber.replace('@c.us', ''), // Use phone number as user ID
                chatUserId: 'tara-ai',
                message: userMessage,
                userDetails: {
                    name: 'WhatsApp User',
                }
            });

            const options = {
                hostname: 'www.tara4u.com',
                port: 443,
                path: '/api/chat',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode === 200) {
                            const jsonData = JSON.parse(data);
                            const reply = jsonData.aiMessage?.content || 'Main yahin hoon, sun rahi hoon 💛';
                            resolve(reply);
                        } else {
                            console.error('TARA API error:', res.statusCode, data);
                            resolve('Main yahin hoon, sun rahi hoon 💛');
                        }
                    } catch (error) {
                        console.error('Error parsing TARA response:', error);
                        resolve('Main yahin hoon, sun rahi hoon 💛');
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Error calling TARA API:', error.message);
                resolve('Main yahin hoon, sun rahi hoon 💛');
            });

            req.write(postData);
            req.end();

        } catch (error) {
            console.error('Error in getTaraResponse:', error);
            resolve('Main yahin hoon, sun rahi hoon 💛');
        }
    });
}

// Handle disconnection
client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp disconnected:', reason);
    console.log('🔄 Restart the bot to reconnect');
});

// Handle authentication failure
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
    console.log('🔄 Delete .wwebjs_auth folder and try again');
});

// Start the client
console.log('🚀 Starting WhatsApp Bot...');
console.log('⏳ Please wait...\n');
client.initialize();

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n\n👋 Shutting down WhatsApp Bot...');
    await client.destroy();
    process.exit(0);
});
