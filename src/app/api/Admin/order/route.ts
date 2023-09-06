import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Order from "@/model/Order";
import connectDB from "@/DB/connectDB";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();

    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const getData = await Order.find({}).populate("orderItems.product").populate('user');

      if (getData) {
        return NextResponse.json(getData, { status: 200 });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No order found.' });
      }
    } else {
      return NextResponse.json({ success: false, message: "No permission to get orders." });
    }
  } catch (error) {
    console.log('Error in getting orders data:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}