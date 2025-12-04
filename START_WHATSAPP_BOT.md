# 🚀 TARA WhatsApp Bot - Quick Start

## ✅ Setup Complete!

Tumhara FREE WhatsApp bot ready hai! Ab koi bhi tumhare number pe message karega, TARA reply karega!

---

## 🎯 Start Karo (3 Steps)

### Step 1: Bot Start Karo

```bash
cd whatsapp-bot
npm start
```

### Step 2: QR Code Scan Karo

1. Terminal me QR code dikhega (black & white squares)
2. Apne phone se **WhatsApp** kholo
3. **Settings** (⚙️) → **Linked Devices** → **Link a Device**
4. QR code scan karo

### Step 3: Done! 🎉

```
✅ WhatsApp Bot is ready!
📞 Your number is now connected to TARA
💬 Anyone can message you and TARA will reply!
```

---

## 📱 Test Karo

Kisi dusre phone se apne number pe message bhejo:
```
Hi TARA
```

TARA automatically reply karega! 😊

---

## 🖥️ 24/7 Running (Optional)

### Option 1: PM2 Use Karo (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
cd whatsapp-bot
pm2 start server.js --name tara-whatsapp

# Save configuration
pm2 save

# Auto-start on system reboot
pm2 startup

# View logs
pm2 logs tara-whatsapp

# Stop bot
pm2 stop tara-whatsapp

# Restart bot
pm2 restart tara-whatsapp
```

### Option 2: Keep Terminal Open

```bash
cd whatsapp-bot
npm start
# Don't close terminal!
```

---

## ⚠️ Important Notes

### 1. Keep Running
- Bot ko running rakhna padega
- Terminal band kiya = bot stop
- PM2 use karo for 24/7

### 2. Internet Connection
- Stable internet chahiye
- WiFi disconnect = bot disconnect

### 3. WhatsApp Session
- QR code sirf ek baar scan karna hai
- Session save ho jata hai
- Agar disconnect ho jaye, phir se scan karo

### 4. Risk
- ⚠️ Unofficial method hai
- ⚠️ WhatsApp ban kar sakta hai
- ⚠️ Use at your own risk

---

## 🔧 Troubleshooting

### Problem: QR Code Nahi Dikh Raha

**Solution**:
```bash
cd whatsapp-bot
rm -rf .wwebjs_auth
npm start
```

### Problem: "Session Closed"

**Solution**: QR code phir se scan karo

### Problem: Bot Reply Nahi Kar Raha

**Check**:
1. Bot running hai? (`npm start`)
2. Internet connected hai?
3. Terminal me errors dikh rahe hain?

### Problem: Number Ban Ho Gaya

**Prevention**:
- Spam mat karo
- Marketing ke liye use mat karo
- Normal conversation hi karo

---

## 📊 Features

✅ **Free**: Completely FREE!
✅ **Your Number**: Tumhara personal number use hota hai
✅ **Auto Reply**: Automatic replies
✅ **TARA AI**: Full TARA intelligence
✅ **Multi-language**: Hindi, English, Hinglish
✅ **Conversation History**: MongoDB me save

---

## 🎉 Success Checklist

- [ ] `npm install` done
- [ ] `npm start` running
- [ ] QR code scanned
- [ ] Test message sent
- [ ] TARA replied
- [ ] Bot running 24/7 (optional)

---

## 💡 Tips

1. **Test First**: Pehle test karo kuch din
2. **Monitor**: Logs check karte raho
3. **Backup**: Important conversations backup karo
4. **Update**: Code update karte raho

---

## 🆚 Comparison

| Method | Cost | Your Number | Setup Time | Risk |
|--------|------|-------------|------------|------|
| **This Bot** | FREE | ✅ Yes | 5 min | ⚠️ Medium |
| Twilio | $0.005/msg | ❌ No | 10 min | ✅ None |
| WhatsApp Business API | $0.005/msg | ✅ Yes | 2-3 weeks | ✅ None |

---

## 📞 Commands

```bash
# Start bot
cd whatsapp-bot
npm start

# Start with PM2 (24/7)
pm2 start server.js --name tara-whatsapp

# View logs
pm2 logs tara-whatsapp

# Stop bot
pm2 stop tara-whatsapp

# Restart bot
pm2 restart tara-whatsapp

# Delete session (for fresh start)
rm -rf .wwebjs_auth
```

---

## 🎊 You're All Set!

Ab tumhare WhatsApp number pe TARA live hai! 

Koi bhi message karega, TARA reply karega! 🚀

**Happy Chatting! 💬**
