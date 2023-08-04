import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Order from "@/model/Order";
import connectDB from "@/DB/connectDB";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const _id = await req.json();

      if(!_id) {
        return NextResponse.json({ success: false, message: "Please provide the order id!" });
      }

      const saveData = await Order.findOneAndUpdate({ _id }, { isDelivered: true }, { new: true });
      if (saveData) {
        const getData = await Order.findById(_id).populate("orderItems.product").populate('user');
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the Order status. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in update order status:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}