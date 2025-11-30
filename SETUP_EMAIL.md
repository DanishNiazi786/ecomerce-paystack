# Email Setup Guide - Send OTP to Your Email

To receive OTP codes via email, you need to configure your email service. Here's how to set it up:

## Quick Setup for Gmail (Recommended)

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on **2-Step Verification**
3. Follow the steps to enable it

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other (Custom name)** as device
4. Enter "ShopWithUs" as the name
5. Click **Generate**
6. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Add to .env.local
Create or edit `.env.local` in your project root and add:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

**Important:** 
- Use your actual Gmail address for `SMTP_USER`
- Use the 16-character app password (remove spaces) for `SMTP_PASS`
- Example: `SMTP_PASS=abcdefghijklmnop`

### Step 4: Restart Your Server
After adding the environment variables, restart your Next.js development server:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Alternative: Other Email Services

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Testing

1. After configuration, try signing up with your email
2. Check your inbox (and spam folder) for the OTP email
3. The email will come from the address you set in `SMTP_USER`

## Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify the app password is correct (no spaces)
- Make sure 2-Step Verification is enabled
- Check server console for error messages

**Still not working?**
- Verify `.env.local` file is in the project root
- Make sure you restarted the server after adding variables
- Check that the email address in `SMTP_USER` matches your Gmail account

