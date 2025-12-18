# Stripe Checkout Sessions API Guide

This guide explains how to interact with the Stripe Checkout Sessions API in your application.

## Overview

Your application uses the **Stripe Node.js SDK** to interact with Stripe's API. This is the recommended approach as it provides:
- Type safety
- Automatic request/response handling
- Built-in error handling
- Easy integration with TypeScript

## Current Implementation

Your Netlify function (`netlify/functions/create-checkout-session.ts`) creates checkout sessions using:

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

const session = await stripe.checkout.sessions.create({
  // ... parameters
});
```

## Common Operations

### 1. Create a Checkout Session

**Current Usage** (in your function):
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Product Name",
          description: "Product Description",
        },
        unit_amount: 2000, // $20.00 in cents
      },
      quantity: 1,
    },
  ],
  mode: "payment", // or "subscription" or "setup"
  success_url: "https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://yoursite.com/cancel",
  metadata: {
    order_id: "12345",
  },
});
```

**Key Parameters:**
- `mode`: `"payment"` (one-time), `"subscription"` (recurring), or `"setup"` (save payment method)
- `line_items`: Array of items to purchase
- `success_url`: Where to redirect after successful payment (use `{CHECKOUT_SESSION_ID}` placeholder)
- `cancel_url`: Where to redirect if user cancels
- `payment_method_types`: Array like `["card"]` or `["card", "us_bank_account"]`
- `metadata`: Custom key-value pairs (useful for order tracking)

**Response:**
```typescript
{
  id: "cs_test_...",
  url: "https://checkout.stripe.com/c/pay/...",
  status: "open",
  payment_status: "unpaid",
  // ... other fields
}
```

### 2. Retrieve a Checkout Session

Useful for verifying payment status after redirect:

```typescript
const session = await stripe.checkout.sessions.retrieve(
  "cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u"
);

// Check payment status
if (session.payment_status === "paid") {
  // Fulfill the order
}
```

**Response Fields:**
- `status`: `"open"`, `"complete"`, or `"expired"`
- `payment_status`: `"paid"`, `"unpaid"`, or `"no_payment_required"`
- `customer`: Customer ID if created
- `payment_intent`: PaymentIntent ID for payment mode

### 3. Update a Checkout Session

Update line items or metadata before the session expires:

```typescript
const session = await stripe.checkout.sessions.update(
  "cs_test_...",
  {
    line_items: [
      {
        id: "existing_line_item_id", // Keep existing item
        quantity: 2, // Update quantity
      },
      {
        price_data: {
          currency: "usd",
          product_data: { name: "New Item" },
          unit_amount: 1000,
        },
        quantity: 1, // Add new item
      },
    ],
    metadata: {
      order_id: "updated_order_123",
    },
  }
);
```

**Note:** When updating line items, you must retransmit the entire array.

### 4. List All Checkout Sessions

Get all sessions (useful for admin/dashboard):

```typescript
const sessions = await stripe.checkout.sessions.list({
  limit: 10,
  // Optional filters:
  // customer: "cus_...",
  // payment_status: "paid",
  // status: "complete",
});
```

### 5. Expire a Checkout Session

Manually expire a session (e.g., if user abandons checkout):

```typescript
const session = await stripe.checkout.sessions.expire("cs_test_...");
```

## Alternative: Direct API Calls

If you prefer direct HTTP calls instead of the SDK:

```typescript
// Create session
const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    "payment_method_types[0]": "card",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": "Product Name",
    "line_items[0][price_data][unit_amount]": "2000",
    "line_items[0][quantity]": "1",
    "mode": "payment",
    "success_url": "https://yoursite.com/success",
    "cancel_url": "https://yoursite.com/cancel",
  }),
});

const session = await response.json();
```

**Note:** The SDK approach is recommended for easier error handling and type safety.

## Adding New Features

### Add Shipping Address Collection

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing params
  shipping_address_collection: {
    allowed_countries: ["US", "CA"],
  },
});
```

### Add Customer Email Prefill

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing params
  customer_email: "customer@example.com",
});
```

### Add Promotion Codes

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing params
  allow_promotion_codes: true,
});
```

### Add Tax Calculation

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing params
  automatic_tax: {
    enabled: true,
  },
});
```

### Add Custom Fields

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing params
  custom_fields: [
    {
      key: "engraving",
      label: {
        type: "custom",
        custom: "Engraving Text",
      },
      type: "text",
    },
  ],
});
```

## Error Handling

The Stripe SDK throws errors that you should catch:

```typescript
try {
  const session = await stripe.checkout.sessions.create({...});
} catch (error) {
  if (error instanceof Stripe.errors.StripeCardError) {
    // Card was declined
    console.error("Card error:", error.message);
  } else if (error instanceof Stripe.errors.StripeRateLimitError) {
    // Too many requests
    console.error("Rate limit error");
  } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
    // Invalid parameters
    console.error("Invalid request:", error.message);
  } else {
    // Other error
    console.error("Stripe error:", error);
  }
}
```

## Webhooks (Recommended)

For production, set up webhooks to handle payment events:

1. **Create a webhook endpoint** in your Netlify function:
```typescript
// netlify/functions/stripe-webhook.ts
export const handler: Handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig!,
      webhookSecret!
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle the event
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    // Fulfill the order
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
```

2. **Configure webhook in Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yoursite.com/.netlify/functions/stripe-webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`

## Testing

Use Stripe's test mode and test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for more testing details.

## Resources

- [Stripe Checkout Sessions API Reference](https://docs.stripe.com/api/checkout/sessions)
- [Stripe Checkout Quickstart](https://stripe.com/docs/payments/checkout)
- [Stripe Node.js SDK](https://github.com/stripe/stripe-node)

