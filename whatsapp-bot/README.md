# 🆓 Free WhatsApp Bot for TARA

Tumhare personal WhatsApp number pe TARA bot chalane ke liye!

## ⚠️ Important Warning

- **Unofficial**: WhatsApp ToS ke against hai
- **Risk**: Number ban ho sakta hai
- **Unstable**: Kabhi-kabhi disconnect ho sakta hai
- **Always On**: Laptop/server always on rakhna padega

**Use at your own risk!**

---

## 🚀 Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
cd whatsapp-bot
npm install
```

### Step 2: Start Bot

```bash
npm start
```

### Step 3: Scan QR Code

1. Terminal me QR code dikhega
2. Apne phone se WhatsApp kholo
3. **Settings** → **Linked Devices** → **Link a Device**
4. QR code scan karo

### Step 4: Done! 🎉

Ab koi bhi tumhare WhatsApp number pe message karega, TARA reply karega!

---

## 📱 How It Works

```
User → Your WhatsApp Number (+917976696076)
         ↓
    WhatsApp Web (Bot)
         ↓
    TARA API (tara4u.com)
         ↓
    AI Response
         ↓
User ← Reply from TARA
```

---

## 🎯 Features

✅ Works with your personal number
✅ Completely FREE
✅ Auto-replies to all messages
✅ Uses your existing TARA AI
✅ Saves conversations in MongoDB
✅ Hindi/English/Hinglish support

---

## 🖥️ Running 24/7

### Option 1: Keep Laptop On
```bash
npm start
# Keep terminal open
```

### Option 2: Use PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name tara-whatsapp
pm2 save
pm2 startup
```

### Option 3: Deploy to Server
- Deploy to VPS (DigitalOcean, AWS, etc.)
- Keep bot running 24/7
- Cost: ~$5/month

---

## 🔧 Configuration

### Ignore Group Messages

Already configured! Bot ignores group messages by default.

### Custom Responses

Edit `server.js`:
```javascript
// Add custom logic
if (message.body.toLowerCase() === 'help') {
    await message.reply('Main TARA hoon! Kaise help kar sakti hoon?');
    return;
}
```

### Change TARA API URL

Edit line 67 in `server.js`:
```javascript
const response = await fetch('http://localhost:3000/api/chat', {
    // For local testing
});
```

---

## 🐛 Troubleshooting

### Issue: QR Code Not Showing

**Fix**:
```bash
rm -rf .wwebjs_auth
npm start
```

### Issue: "Session Closed"

**Fix**: Scan QR code again

### Issue: Bot Not Responding

**Check**:
1. Bot running? (`npm start`)
2. Internet connected?
3. TARA API working? (test: https://www.tara4u.com/api/chat)

### Issue: Number Banned

**Prevention**:
- Don't spam
- Don't use for marketing
- Keep message rate low
- Use official API for production

---

## 📊 Monitoring

### View Logs
```bash
# If using PM2
pm2 logs tara-whatsapp

# If using npm start
# Logs show in terminal
```

### Stop Bot
```bash
# If using PM2
pm2 stop tara-whatsapp

# If using npm start
# Press Ctrl+C
```

---

## 🆚 Comparison

| Feature | Free Bot | Twilio | WhatsApp Business API |
|---------|----------|--------|----------------------|
| Cost | FREE | $0.005/msg | $0.005/msg |
| Setup Time | 5 min | 10 min | 2-3 weeks |
| Your Number | ✅ Yes | ❌ No | ✅ Yes |
| Reliable | ⚠️ Medium | ✅ High | ✅ High |
| Risk of Ban | ⚠️ Yes | ✅ No | ✅ No |
| 24/7 | Need server | ✅ Yes | ✅ Yes |

---

## 🎉 Success!

Agar sab kaam kar raha hai:
- ✅ Bot running
- ✅ QR code scanned
- ✅ Messages auto-replying
- ✅ TARA responding properly

**Congratulations! TARA is now live on your WhatsApp! 🚀**

---

## ⚡ Quick Commands

```bash
# Start bot
npm start

# Start with auto-restart
npm run dev

# Start with PM2 (24/7)
pm2 start server.js --name tara-whatsapp

# View logs
pm2 logs tara-whatsapp

# Stop bot
pm2 stop tara-whatsapp

# Restart bot
pm2 restart tara-whatsapp
```

---

## 📞 Support

Issues? Check:
1. Bot logs
2. TARA API status
3. Internet connection
4. WhatsApp Web status

---

## 🔒 Security Tips

1. Don't share QR code
2. Don't run on public WiFi
3. Keep bot code private
4. Monitor for unusual activity
5. Have backup of conversations

---

**Happy Chatting! 💬**
