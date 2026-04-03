import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";;


const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID!,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
})

export async function POST(req: NextRequest) {

    const options = {
        amount: 30000,
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 1,
    }

    try {
        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);

    } catch (error) {
        return NextResponse.json(
            {message: "Error while handling payments, Please again"},
            {status: 500}
        )
    }
}