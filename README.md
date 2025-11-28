# Modern E-Commerce Store

A premium, high-performance e-commerce store built with Next.js 15, Tailwind CSS, and MongoDB.

## Features

- **Modern Design**: Glassmorphism, subtle gradients, and smooth animations.
- **Product Management**: Browse by category, view details, and filter products.
- **Shopping Cart**: Fully functional cart with persistent state.
- **Wishlist**: Save items for later.
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
   Create a `.env.local` file in the root directory and add your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Seed the database**
   Populate the database with initial data:
   ```bash
   npx tsx scripts/seed.ts
   ```

5. **Run the development server**
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

## Deployment

The project is ready for deployment on Vercel. Simply connect your GitHub repository and deploy.
