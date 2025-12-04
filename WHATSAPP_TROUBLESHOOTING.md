# 🔧 WhatsApp Integration Troubleshooting

## Common Issues & Solutions

### ❌ Issue 1: "Configure your WhatsApp Sandbox's Inbound URL"

**Cause**: Webhook URL not configured in Twilio

**Solution**:
1. Go to: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. In "When a message comes in" field, enter:
   ```
   https://yourdomain.com/api/whatsapp/webhook
   ```
3. Method: **POST**
4. Click **Save**

---

### ❌ Issue 2: Webhook Returns 404

**Cause**: Route file not deployed or wrong path

**Check**:
```bash
# Test if webhook exists
curl https://yourdomain.com/api/whatsapp/webhook

# Should return: {"status":"WhatsApp webhook is active",...}
```

**Solution**:
- Make sure `app/api/whatsapp/webhook/route.js` exists
- Redeploy your app
- Clear build cache and redeploy

---

### ❌ Issue 3: Webhook Returns 500 Error

**Cause**: Missing environment variables or MongoDB connection issue

**Check Logs**:
- Vercel: Dashboard → Your Project → Logs
- Look for errors in function execution

**Solution**:
1. Add ALL environment variables in production:
   ```
   MONGODB_URI
   GROQ_API_KEY
   GROQ_API_KEY_INSIGHTS
   GROQ_API_KEY_2
   GROQ_API_KEY_3
   GROQ_API_KEY_4
   TWILIO_ACCOUNT_SID
   TWILIO_AUTH_TOKEN
   TWILIO_WHATSAPP_NUMBER
   NEXT_PUBLIC_APP_URL
   ```

2. Redeploy after adding env vars

---

### ❌ Issue 4: TARA Not Responding

**Cause**: Chat API failing or Twilio credentials wrong

**Debug**:
```bash
# Test chat API directly
curl -X POST https://yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "chatUserId": "tara-ai",
    "message": "Hi TARA"
  }'
```

**Solution**:
- Check GROQ_API_KEY is valid
- Check MongoDB connection
- Verify Twilio credentials

---

### ❌ Issue 5: Twilio Can't Reach Webhook

**Cause**: Domain not accessible or HTTPS issue

**Check**:
```bash
# Test from external source
curl -I https://yourdomain.com/api/whatsapp/webhook

# Should return: HTTP/2 200
```

**Solution**:
- Make sure domain has valid SSL certificate
- Check if domain is publicly accessible
- Verify no firewall blocking Twilio IPs

---

### ❌ Issue 6: "Twilio Sandbox: Your number is not connected"

**Cause**: User hasn't joined sandbox

**Solution**:
User must send this message first:
```
To: +1 415 523 8886
Message: join occur-them
```

---

## 🔍 Debug Checklist

Run through this checklist:

### 1. Deployment
- [ ] App deployed successfully
- [ ] No build errors
- [ ] Domain is accessible

### 2. Environment Variables (Production)
- [ ] MONGODB_URI set
- [ ] GROQ_API_KEY set
- [ ] TWILIO_ACCOUNT_SID set
- [ ] TWILIO_AUTH_TOKEN set
- [ ] TWILIO_WHATSAPP_NUMBER set
- [ ] NEXT_PUBLIC_APP_URL set

### 3. Twilio Configuration
- [ ] Webhook URL configured
- [ ] Method set to POST
- [ ] Configuration saved
- [ ] Sandbox joined (sent "join" message)

### 4. Testing
- [ ] Webhook endpoint returns 200
- [ ] Chat API works
- [ ] WhatsApp message sent
- [ ] TARA responds

---

## 🧪 Manual Testing Steps

### Test 1: Webhook Health Check
```bash
curl https://yourdomain.com/api/whatsapp/webhook
```
Expected: `{"status":"WhatsApp webhook is active",...}`

### Test 2: Simulate Twilio Request
```bash
curl -X POST https://yourdomain.com/api/whatsapp/webhook \
  -d "From=whatsapp:+919928005564" \
  -d "To=whatsapp:+14155238886" \
  -d "Body=Test message" \
  -d "ProfileName=Test User"
```
Expected: XML response `<Response></Response>`

### Test 3: Check Twilio Logs
1. Go to: https://console.twilio.com/us1/monitor/logs/errors
2. Look for recent errors
3. Check error details

---

## 📊 Common Error Messages

### "Error 11200: HTTP retrieval failure"
- Webhook URL is not accessible
- Check domain and SSL certificate

### "Error 21211: Invalid 'To' Phone Number"
- TWILIO_WHATSAPP_NUMBER format wrong
- Should be: `whatsapp:+14155238886`

### "Error 20003: Authentication Error"
- TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN wrong
- Verify credentials in Twilio Console

### "Error 21408: Permission to send an SMS"
- Sandbox not joined
- Send "join occur-them" first

---

## 🆘 Still Not Working?

### Get Detailed Logs:

**Vercel Logs**:
```bash
vercel logs your-project-name --follow
```

**Twilio Debugger**:
https://console.twilio.com/us1/monitor/debugger

**Test Locally**:
```bash
# Run locally
npm run dev

# Use ngrok for public URL
npx ngrok http 3000

# Configure ngrok URL in Twilio temporarily
```

---

## 💡 Pro Tips

1. **Always check Twilio logs first** - They show exactly what's failing
2. **Test webhook directly** - Don't rely only on WhatsApp testing
3. **Verify environment variables** - Most issues are missing env vars
4. **Check deployment logs** - Build errors can cause 404s
5. **Use Twilio debugger** - Shows all webhook calls and responses

---

## 📞 Need More Help?

Share these details:
1. Your domain URL
2. Error message you're seeing
3. Twilio error logs (if any)
4. Deployment logs
5. Response from: `curl https://yourdomain.com/api/whatsapp/webhook`
