import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import getCurrentUser from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);

  const price: any = Math.floor(totalPrice);

  return price;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { items, payment_intent_id } = body;
  const total = calculateOrderAmount(items) * 100;
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      );

      // update the order
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount: total,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.error();
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // create the intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    //create the order
    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }

  // return a default response (e.q., an error response) if none of the conditions are met
  return NextResponse.error();
}

// import { NextResponse } from "next/server";
// import { CartProductType } from "@/app/product/[productId]/ProductDetails";
// import { getCurrentUser } from "@/app/actions/getCurrentUser";
// import Stripe from "stripe";
// import prisma from "@/libs/prismadb";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-06-20",
// });

// const calculateOrderAmount = (items: CartProductType[]) => {
//   return items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100;
// };

// export async function POST(request: Request) {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { items, payment_intent_id } = body;

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
//     }

//     const total = calculateOrderAmount(items);

//     if (total <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     const orderData = {
//       user: { connect: { id: currentUser.id } },
//       amount: total,
//       currency: "usd",
//       status: "pending",
//       deliveryStatus: "pending",
//       paymentIntentId: payment_intent_id,
//       products: items,
//     };

//     if (payment_intent_id) {
//       const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

//       if (!current_intent) {
//         return NextResponse.json({ error: "Payment intent not found" }, { status: 404 });
//       }

//       const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
//         amount: total,
//       });

//       const existing_order = await prisma.order.findFirst({
//         where: { paymentIntentId: payment_intent_id },
//       });

//       if (!existing_order) {
//         return NextResponse.json({ error: "Invalid payment intent" }, { status: 400 });
//       }

//       const updated_order = await prisma.order.update({
//         where: { id: existing_order.id },
//         data: {
//           amount: total,
//           products: items,
//         },
//       });

//       return NextResponse.json({
//         paymentIntent: updated_intent,
//         order: updated_order,
//       });
//     } else {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: total,
//         currency: "usd",
//         automatic_payment_methods: { enabled: true },
//       });

//       orderData.paymentIntentId = paymentIntent.id;

//       const new_order = await prisma.order.create({
//         data: orderData,
//       });

//       return NextResponse.json({
//         success: true,
//         order: new_order,
//         paymentIntent,
//       });
//     }
//   } catch (error) {
//     console.error("Error in payment processing", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
