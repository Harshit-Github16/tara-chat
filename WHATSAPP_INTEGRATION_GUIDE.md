# TARA WhatsApp Integration Guide

## Overview
Yeh guide tumhe step-by-step batayega ki kaise TARA chatbot ko WhatsApp pe integrate karo using Twilio.

## Prerequisites
- Twilio account (free trial available)
- Vercel/deployed Next.js app (public URL chahiye)
- WhatsApp number for testing

---

## Step 1: Twilio Setup

### 1.1 Twilio Account Banao
1. Visit: https://www.twilio.com/try-twilio
2. Sign up karo (free trial milega $15 credit)
3. Phone number verify karo

### 1.2 WhatsApp Sandbox Setup
1. Twilio Console me jao: https://console.twilio.com/
2. Left sidebar me "Messaging" > "Try it out" > "Send a WhatsApp message"
3. Sandbox join karo:
   - Apne WhatsApp se Twilio number pe message bhejo
   - Format: `join <your-sandbox-code>`
   - Example: `join happy-elephant-123`

### 1.3 Get Credentials
Twilio Console se ye details note karo:
- Account SID
- Auth Token
- WhatsApp number (format: `whatsapp:+14155238886`)

---

## Step 2: Environment Variables

Apne `.env.local` file me add karo:

```env
# Existing variables...
GROQ_API_KEY=your_existing_key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## Step 3: Install Dependencies

```bash
npm install twilio
```

---

## Step 4: Create WhatsApp Webhook API

File: `app/api/whatsapp/webhook/route.js`

Yeh API Twilio se messages receive karegi aur TARA se response bhejegi.

---

## Step 5: Deploy & Configure Webhook

### 5.1 Deploy Your App
```bash
npm run build
# Deploy to Vercel or your hosting
```

### 5.2 Configure Twilio Webhook
1. Twilio Console me jao
2. "Messaging" > "Settings" > "WhatsApp Sandbox Settings"
3. "When a message comes in" field me apna webhook URL dalo:
   ```
   https://your-app.vercel.app/api/whatsapp/webhook
   ```
4. HTTP Method: POST
5. Save karo

---

## Step 6: Testing

1. Apne WhatsApp se Twilio sandbox number pe message bhejo
2. TARA respond karega!

Example conversation:
```
You: Hi TARA
TARA: Hey! Kaise ho? Aaj ka din kaisa chal raha hai? 😊

You: Main thik hoon
TARA: Achha hai! Kuch special hua aaj?
```

---

## Step 7: Production (Optional)

### For Production WhatsApp Business API:
1. Meta Business Account banao
2. WhatsApp Business API access request karo
3. Business verification complete karo
4. Twilio se production number buy karo
5. Webhook URL update karo

**Cost**: ~$0.005 per message (bahut sasta)

---

## Features Supported

✅ Text messages
✅ Hindi/Hinglish support
✅ Mood-based responses
✅ Conversation history
✅ Multi-user support
✅ Emoji support

---

## Troubleshooting

### Issue: Messages not receiving
- Check webhook URL is correct
- Verify Twilio credentials in .env
- Check Vercel deployment logs

### Issue: TARA not responding
- Check Groq API key is valid
- Verify MongoDB connection
- Check API logs in Vercel

### Issue: Language mixing
- TARA automatically detects language
- Responds in same language as user

---

## Next Steps

1. Test thoroughly in sandbox
2. Add media support (images, voice)
3. Add WhatsApp buttons/quick replies
4. Move to production API
5. Add analytics

---

## Support

- Twilio Docs: https://www.twilio.com/docs/whatsapp
- TARA Issues: Check your app logs
- Need help? Check Vercel deployment logs

---

## Cost Estimate

**Sandbox (Testing)**: FREE
**Production**: 
- ~$0.005 per message
- 1000 messages = $5
- Very affordable!
