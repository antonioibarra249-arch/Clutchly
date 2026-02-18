import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Try to find user in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    }).catch(() => null);

    let customerId: string | undefined;

    if (user) {
      // Existing user — reuse or create Stripe customer
      customerId = user.stripeCustomerId ?? undefined;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: {
            clutchly_user_id: user.id,
            riot_name: user.riotName ?? "",
            riot_tag: user.riotTag ?? "",
          },
        });
        customerId = customer.id;

        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    // Create checkout session (works with or without a DB user)
    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PLANS.pro.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/home?upgraded=true`,
      cancel_url: `${appUrl}/home?cancelled=true`,
      metadata: {
        clutchly_user_id: userId,
      },
      subscription_data: {
        metadata: {
          clutchly_user_id: userId,
        },
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT] Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
