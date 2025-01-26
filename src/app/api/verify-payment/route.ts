import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    if (!request.body) {
        return NextResponse.json(
          { message: "Request body is missing." },
          { status: 400 }
        );
      }
    const body = await request.json();
    console.log("Request body:", body);
 

    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
        return NextResponse.json({ message: 'Missing required fields' },{ status: 400 });
    }


    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        return NextResponse.json({ message: 'RAZORPAY_KEY_SECRET is not defined' }, { status: 500 });
    }

    const generatedSignature = crypto 
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    if (generatedSignature === signature) {
        // Payment is verified
        return NextResponse.json({ message: 'Payment successful' },{ status: 200 });
    } else {
        // Payment verification failed
        return NextResponse.json({ message: 'Payment verification failed' },{ status: 400 });
    }
};
