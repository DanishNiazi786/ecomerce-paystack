# Quick Email Setup - Get OTP Working Now!

## The Problem
Your `.env.local` file is missing `SMTP_USER` and `SMTP_PASS`. That's why emails aren't being sent.

## Quick Fix (5 minutes)

### Step 1: Get Gmail App Password
1. Go to: **https://myaccount.google.com/apppasswords**
2. If you see "App passwords aren't available", enable **2-Step Verification** first:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
   - Then go back to App Passwords
3. Generate App Password:
   - Select **Mail**
   - Select **Other (Custom name)**
   - Type: `ShopWithUs`
   - Click **Generate**
   - **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env.local
Open `.env.local` and add these lines (replace `YOUR_APP_PASSWORD_HERE` with the password you copied):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=danishsarfraz917@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Important:** 
- Remove spaces from the app password
- Example: If Google gives you `abcd efgh ijkl mnop`, use `abcdefghijklmnop`

### Step 3: Restart Server
1. **Stop** your current server (Press `Ctrl+C` in terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

### Step 4: Test
1. Try signing up again
2. Check your email inbox (and spam folder)
3. You should receive the OTP email!

## Still Not Working?

Check the terminal console. You should see:
- ✅ `Verifying email connection...`
- ✅ `Email connection verified successfully`
- ✅ `Sending OTP email to...`
- ✅ `Email sent successfully!`

If you see errors, check:
- App password is correct (no spaces)
- 2-Step Verification is enabled
- Server was restarted after adding variables

