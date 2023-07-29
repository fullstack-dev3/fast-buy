import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Order from "@/model/Order";
import connectDB from "@/DB/connectDB";

export const dynamic  = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();

    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Order.find({}).populate("orderItems.product").populate('user');

      if (getData) {
        return NextResponse.json(getData, { status: 200 });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No Order Found.' });
      }

    } else {
      return NextResponse.json({ success: false, message: "You are not authorized. Please login!" });
    }
  } catch (error) {
    console.log('Error in getting  Orders Data :', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}