import Stripe from "stripe";
import { createClerkClient } from "@clerk/clerk-sdk-node";

export const handler = async (event: any) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const clerkKey = process.env.CLERK_SECRET_KEY;

  if (!stripeKey || !webhookSecret || !clerkKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing server configuration" }),
    };
  }

  const stripe = new Stripe(stripeKey);
  const sig = event.headers["stripe-signature"];

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid signature" }),
    };
  }

  const clerk = createClerkClient({ secretKey: clerkKey });

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;

      if (clerkUserId) {
        await clerk.users.updateUser(clerkUserId, {
          publicMetadata: {
            plan: "pro",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;

      if (clerkUserId) {
        await clerk.users.updateUser(clerkUserId, {
          publicMetadata: {
            plan: "free",
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: null,
          },
        });
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook handler failed" }),
    };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
