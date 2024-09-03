import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send("Webhook Error: " + err);
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge: any = event.data.object as Stripe.Charge;

      console.log("Received charge object:", charge);

      if (typeof charge.payment_intent === "string") {
        try {
          const existingOrder = await prisma.order.findFirst({
            where: { paymentIntentId: charge.payment_intent },
          });

          if (existingOrder?.status === "complete") {
            // Eğer ödeme zaten tamamlandıysa, işlemi tekrar etmiyoruz
            return res.status(200).send("Order already completed");
          }

          await prisma.order.update({
            where: { paymentIntentId: charge.payment_intent },
            data: {
              status: "complete",
              address: {
                set: {
                  line1: charge.shipping?.address?.line1 || "",
                  line2: charge.shipping?.address?.line2 || "",
                  city: charge.shipping?.address?.city || "",
                  state: charge.shipping?.address?.state || "",
                  postalCode: charge.shipping?.address?.postal_code || "",
                },
              },
            },
          });
        } catch (error) {
          console.error("Error updating order:", error);
          return res.status(500).send("Error updating order");
        }
      }
      break;

    case "payment_intent.created":
      console.log("Payment intent created:", event.data.object);
      break;

    case "payment_intent.succeeded":
      console.log("Payment intent succeeded:", event.data.object);
      break;

    case "charge.updated":
      console.log("Charge updated:", event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  res.status(200).send("Webhook received");
}
