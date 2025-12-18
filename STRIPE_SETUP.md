# Stripe Sandbox Integration Setup

This guide will help you set up Stripe checkout integration with a sandbox/test account.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Setup Steps

### 1. Get Your Stripe Test API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### 2. Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following environment variable:
   - **Key**: `STRIPE_SECRET_KEY`
   - **Value**: Your Stripe test secret key (starts with `sk_test_`)
4. Click **Save**

### 3. For Local Development

1. **Install Netlify CLI** (if not already installed):

   ```bash
   npm install -g netlify-cli
   ```

2. **Create a `.env` file** in the root of your project (this file should be in `.gitignore`):

   ```env
   STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
   ```

3. **Run Netlify Dev** to start the development server with functions support:

   ```bash
   netlify dev
   ```

   This will:

   - Start the Vite dev server
   - Start the Netlify Functions server on port 8888
   - Load environment variables from `.env` file
   - Proxy function requests correctly

**Note**: Never commit your secret keys to version control!

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Add items to your cart
3. Go to checkout
4. Click "Proceed to Payment"
5. You'll be redirected to Stripe's test checkout page

### 5. Test Payment Methods

Use Stripe's test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0025 0000 3155`

For all test cards:

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### 6. Switch to Production

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Get your **Live** API keys (starts with `pk_live_` and `sk_live_`)
3. Update the `STRIPE_SECRET_KEY` environment variable in Netlify with your live secret key
4. Update your frontend to use the live publishable key if needed

## Troubleshooting

### "Stripe secret key not configured" error

- Make sure `STRIPE_SECRET_KEY` is set in Netlify environment variables
- For local development, ensure `.env` file exists with the key
- Redeploy your site after adding environment variables

### CORS errors

- The function already handles CORS, but if you see errors, check that the function is deployed correctly
- Make sure your Netlify function is accessible at `/.netlify/functions/create-checkout-session`

### Payment not processing

- Verify you're using test mode keys (start with `sk_test_`)
- Check the Stripe Dashboard → **Payments** to see if the payment attempt was logged
- Check browser console and Netlify function logs for errors

## Security Notes

- **Never** expose your secret key in client-side code
- Always use environment variables for sensitive keys
- Test keys are safe to use in development but should not be used in production
- Regularly rotate your API keys for security

## Additional Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
