import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PRICE_IDS = {
  annually: process.env.STRIPE_PRICE_ANNUALLY as string,
  monthly: process.env.STRIPE_PRICE_MONTHLY as string,
} as const;

export async function POST(req: NextRequest) {
  try {
    const { plan, userEmail, userId } = await req.json();

    // create or find the customer by user.email/userId
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { firebaseUid: userId },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      expand: ["latest_invoice.confirmation_secret"],
      items: [{ price: PRICE_IDS[plan] }],
      metadata: { firebaseUid: userId, plan },
      payment_behavior: "default_incomplete",
    });

    const invoice: any = subscription.latest_invoice;
    const confirmationSecret = invoice?.confirmation_secret?.client_secret;

    if (!confirmationSecret) {
      return NextResponse.json(
        { error: "Missing confirmation_secret client_secret." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      clientSecret: confirmationSecret,
      customerId: customer.id,
      subscriptionId: subscription.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
