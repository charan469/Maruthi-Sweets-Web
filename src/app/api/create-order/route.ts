import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { message: "Request body is missing." },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);
    console.log("Amount:", body.amount);
    const order = await razorpay.orders.create({
      amount: body.amount * 100,
      currency: "INR",
      receipt: "receipt" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}
