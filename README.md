# Fieldstay

An Airbnb-style booking MVP. Built with Next.js 14, Firestore, NextAuth, and Stripe.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in credentials
3. Enable Email/Password and Google providers in Firebase Auth
4. Create Firestore collections: `users`, `listings`, `bookings`
5. `npm run dev`

## Stripe webhook

Point a Stripe webhook at `/api/webhooks/stripe`. Listen for `checkout.session.completed`.