# Email Configuration Guide

This application uses nodemailer to send OTP emails. You need to configure your email service credentials.

## Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration (using Gmail as example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Or use these alternative variable names
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@shopwithus.com
```

## Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS` or `EMAIL_PASSWORD`

## Other Email Services

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Development Mode

In development mode, if email sending fails, the OTP will be logged to the console for testing purposes.

## Testing

You can test the email functionality by:
1. Signing up with a valid email
2. Checking your email inbox for the OTP
3. In development, check the console for OTP if email fails

