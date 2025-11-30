# Modern E-Commerce Store

A premium, high-performance e-commerce store built with Next.js 15, Tailwind CSS, and MongoDB.

## Features

- **Modern Design**: Glassmorphism, subtle gradients, and smooth animations.
- **Product Management**: Browse by category, view details, and filter products.
- **Shopping Cart**: Fully functional cart with persistent state.
- **Wishlist**: Save items for later.
- **User Authentication**: Sign up, login, OTP verification.
- **Payment Integration**: Full Paystack integration with KES currency.
- **Admin Panel**: Complete admin dashboard for managing products, orders, and categories.
- **Order Management**: Automatic order creation, inventory management, and email confirmations.
- **Responsive**: Optimized for mobile, tablet, and desktop.
- **SEO Optimized**: Metadata, OpenGraph, and semantic HTML.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 + shadcn/ui
- **Database**: MongoDB + Mongoose
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory (copy from `.env.local.example`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   JWT_SECRET=your-secret-key
   ```
   
   **For Email Setup (OTP):** See `SETUP_EMAIL.md` for detailed instructions on configuring Gmail or other email services.

4. **Seed the database**
   Populate the database with initial data:
   ```bash
   npx tsx scripts/seed.ts
   ```

5. **Create admin user**
   Create the first admin user for accessing the admin panel:
   ```bash
   npm run seed:admin
   ```
   Default credentials:
   - Email: `admin@yourstore.com`
   - Password: `Admin@123`
   
   **⚠️ Change the password in `scripts/seed-admin.ts` before production!**

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and database connection.
- `models/`: Mongoose data models.
- `scripts/`: Database seed scripts.
- `store/`: Zustand state stores.
- `types/`: TypeScript type definitions.

## Admin Panel

Access the admin panel at `/admin` (requires admin role).

### Features:
- **Dashboard**: Sales statistics, order counts, recent orders
- **Products**: Create, edit, delete products with full inventory management
- **Orders**: View orders, update status, print invoices
- **Categories**: Manage product categories

See `MILESTONE_2_COMPLETE.md` for detailed admin panel documentation.

## Deployment

The project is ready for deployment on Vercel. Simply connect your GitHub repository and deploy.

### Environment Variables for Production:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PAYSTACK_SECRET_KEY` - Paystack secret key (use live key in production)
- `NEXT_PUBLIC_BASE_URL` - Your production URL
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` - Email configuration

### Paystack Webhook Setup:
1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Select event: `charge.success`
