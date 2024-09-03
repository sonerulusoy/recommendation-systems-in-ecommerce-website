import  getCurrentUser  from "@/actions/getCurrentUser";
import Order from "@/app/order/[orderId]/page";
import { Review } from "@prisma/client"; // emin değilim
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { comment, rating, product, userId } = body;

  // 17 ve 30. satır arasındaki kodu test amaçlı yani rating testi amaçlı gerektidğinde yorum satırı yapabliriz.
  const deliveredOrder = currentUser?.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === currentUser.id;
  }); 

  if (userReview || !deliveredOrder) {
    return NextResponse.error();
  }

  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId,
    },
  });

  return NextResponse.json(review);
}
