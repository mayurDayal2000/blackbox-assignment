import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // if (event.type === "checkout.session.completed") {
  //   const session = event.data.object as Stripe.Checkout.Session;
  //   const subscriptionId = session.subscription as string | null;
  //   const customerId = session.customer as string | null;
  //   const plan = session.metadata?.plan;

  // TODO: Update your database (e.g., Firestore) using session.metadata.firebaseUid
  // Mark user as active, store subscriptionId, customerId, plan, current_period_end, etc.
  // }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    // TODO: Revoke access in your database for sub.customer
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
