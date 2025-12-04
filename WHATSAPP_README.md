# 📱 TARA WhatsApp Integration - Complete Guide

## ✅ Features

- ✅ **Inbound Messages**: Users can chat with TARA on WhatsApp
- ✅ **Outbound Messages**: TARA can send messages to users
- ✅ **Template Messages**: Send approved WhatsApp templates
- ✅ **Conversation History**: All chats saved in MongoDB
- ✅ **Multi-language**: Hindi, English, Hinglish support

---

## 🚀 Quick Setup (5 Minutes)

### 1. Environment Variables

`.env.local` me ye add karo:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_APP_URL=https://www.tara4u.com
```

### 2. Deploy Code

```bash
git add .
git commit -m "Add WhatsApp integration"
git push
```

### 3. Configure Twilio Webhook

1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. "When a message comes in": `https://www.tara4u.com/api/whatsapp/webhook`
3. Method: `POST`
4. Save

### 4. Test!

WhatsApp se message bhejo:
```
To: +1 415 523 8886
Message: Hi TARA
```

---

## 📡 API Endpoints

### 1. Inbound Webhook (Automatic)

**Endpoint**: `POST /api/whatsapp/webhook`

Twilio automatically calls this when user sends message.

### 2. Send Outbound Message

**Endpoint**: `POST /api/whatsapp/send`

**Body**:
```json
{
  "to": "whatsapp:+919876543210",
  "message": "Hello from TARA!"
}
```

**Example**:
```bash
curl -X POST https://www.tara4u.com/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "whatsapp:+919876543210",
    "message": "Hi! This is TARA 😊"
  }'
```

### 3. Send Template Message

**Body**:
```json
{
  "to": "whatsapp:+919876543210",
  "contentSid": "HXb5b62575e6e4ff6129ad7c8efe1f983e",
  "variables": {
    "1": "12/1",
    "2": "3pm"
  }
}
```

---

## 🧪 Testing

### Local Test:
```bash
npm run dev
node test-whatsapp-complete.js whatsapp:+919928005564
```

### Production Test:
```bash
node test-whatsapp-complete.js whatsapp:+919928005564
```

---

## 💡 Use Cases

### 1. User Chats with TARA
User WhatsApp se message bhejta hai → TARA reply karta hai

### 2. Daily Mood Reminders
```javascript
// Send reminder at 9 AM daily
await fetch('https://www.tara4u.com/api/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'whatsapp:+919876543210',
    message: '🌅 Good morning! How are you feeling today?'
  })
});
```

### 3. Journal Prompts
```javascript
await fetch('https://www.tara4u.com/api/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'whatsapp:+919876543210',
    message: '📝 Time to reflect! What made you smile today?'
  })
});
```

---

## 🔧 Troubleshooting

### Issue: "Configure your WhatsApp Sandbox's Inbound URL"

**Fix**: Webhook URL configure karo Twilio me

### Issue: No reply from TARA

**Check**:
1. Twilio webhook configured?
2. Environment variables set?
3. Sandbox joined? (send "join occur-them")

### Issue: Outbound message fails

**Check**:
1. TWILIO_AUTH_TOKEN correct?
2. User ne sandbox join kiya?
3. Number format: `whatsapp:+919876543210`

---

## 📊 Monitoring

### Twilio Logs:
https://console.twilio.com/us1/monitor/logs/errors

### Vercel Logs:
Dashboard → Your Project → Logs

---

## 💰 Cost

**Sandbox (Testing)**: FREE
**Production**: ~$0.005 per message

---

## 🎉 Success!

Agar sab kaam kar raha hai:
- ✅ Users can chat with TARA on WhatsApp
- ✅ TARA can send notifications
- ✅ All conversations saved in database
- ✅ Multi-language support working

**Congratulations! TARA is now live on WhatsApp! 🚀**
