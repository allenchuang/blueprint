import type { FastifyInstance } from "fastify";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function getStripeClient() {
  if (!STRIPE_SECRET_KEY) return null;
  // Dynamic import avoids crash when stripe isn't configured
  const Stripe = require("stripe");
  return new Stripe(STRIPE_SECRET_KEY) as import("stripe").default;
}

export async function stripeRoutes(app: FastifyInstance) {
  const stripe = getStripeClient();

  const notConfiguredResponse = {
    statusCode: 503,
    error: "stripe_not_configured",
    message: "Stripe is not configured for this environment",
  };

  app.post(
    "/stripe/create-checkout-session",
    {
      schema: {
        description: "Create a Stripe Checkout Session for subscription signup",
        tags: ["stripe"],
        body: {
          type: "object",
          required: ["priceId"],
          properties: {
            priceId: { type: "string" },
            userId: { type: "string" },
            successUrl: { type: "string" },
            cancelUrl: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              url: { type: "string" },
              sessionId: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!stripe) return reply.status(503).send(notConfiguredResponse);

      const { priceId, successUrl, cancelUrl } = request.body as {
        priceId: string;
        userId?: string;
        successUrl?: string;
        cancelUrl?: string;
      };

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url:
          successUrl ?? `${request.headers.origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl ?? `${request.headers.origin}/pricing`,
      });

      return { url: session.url, sessionId: session.id };
    }
  );

  app.post(
    "/stripe/create-payment-intent",
    {
      schema: {
        description: "Create a PaymentIntent for one-time payments (React Native PaymentSheet)",
        tags: ["stripe"],
        body: {
          type: "object",
          required: ["amount"],
          properties: {
            amount: { type: "number" },
            currency: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              clientSecret: { type: "string" },
              customer: { type: "string" },
              publishableKey: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!stripe) return reply.status(503).send(notConfiguredResponse);

      const { amount, currency = "usd" } = request.body as {
        amount: number;
        currency?: string;
      };

      const customer = await stripe.customers.create();

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        customer: customer.id,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
      };
    }
  );

  app.post(
    "/stripe/create-portal-session",
    {
      schema: {
        description: "Create a Stripe Customer Portal session for subscription management",
        tags: ["stripe"],
        body: {
          type: "object",
          required: ["customerId"],
          properties: {
            customerId: { type: "string" },
            returnUrl: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              url: { type: "string" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!stripe) return reply.status(503).send(notConfiguredResponse);

      const { customerId, returnUrl } = request.body as {
        customerId: string;
        returnUrl?: string;
      };

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl ?? `${request.headers.origin}/pricing`,
      });

      return { url: session.url };
    }
  );

  app.get(
    "/stripe/subscription-status",
    {
      schema: {
        description: "Get the current user's subscription status and tier",
        tags: ["stripe"],
        querystring: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              tier: { type: "string" },
              status: { type: "string", nullable: true },
              currentPeriodEnd: { type: "string", nullable: true },
              cancelAtPeriodEnd: { type: "boolean" },
            },
          },
          503: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!stripe) return reply.status(503).send(notConfiguredResponse);

      await app.authenticate(request, reply);
      if (reply.sent) return;

      // TODO: Query subscriptions table using request.dynamicUser?.sub
      return {
        tier: "free",
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }
  );

  app.post(
    "/stripe/webhook",
    {
      schema: {
        description: "Handle Stripe webhook events",
        tags: ["stripe"],
      },
      config: {
        rawBody: true,
      },
    },
    async (request, reply) => {
      if (!stripe) return reply.status(503).send(notConfiguredResponse);

      const sig = request.headers["stripe-signature"] as string;
      let event: import("stripe").Stripe.Event;

      try {
        if (STRIPE_WEBHOOK_SECRET) {
          event = stripe.webhooks.constructEvent(
            request.body as string,
            sig,
            STRIPE_WEBHOOK_SECRET
          );
        } else {
          app.log.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
          event = JSON.parse(request.body as string);
        }
      } catch (err) {
        app.log.error(err, "Webhook signature verification failed");
        return reply.status(400).send({ error: "Invalid signature" });
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          app.log.info({ sessionId: session.id }, "Checkout session completed");
          // TODO: Provision subscription — upsert into subscriptions table
          break;
        }
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          app.log.info({ subscriptionId: subscription.id }, "Subscription updated");
          // TODO: Update subscription status in DB
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          app.log.info({ subscriptionId: subscription.id }, "Subscription deleted");
          // TODO: Mark subscription as canceled in DB
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object;
          app.log.info({ invoiceId: invoice.id }, "Invoice paid");
          // TODO: Continue provisioning
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object;
          app.log.info({ invoiceId: invoice.id }, "Invoice payment failed");
          // TODO: Notify user, update subscription status
          break;
        }
        default:
          app.log.info({ type: event.type }, "Unhandled webhook event");
      }

      return { received: true };
    }
  );
}
