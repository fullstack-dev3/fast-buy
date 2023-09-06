import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Order from "@/model/Order";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const _id = await req.json();

      if(!_id) {
        return NextResponse.json({ success: false, message: "Order ID is required." });
      }

      const saveData = await Order.findOneAndUpdate({ _id }, { isDelivered: true }, { new: true });
      if (saveData) {
        const data = await Order.findById(_id).populate("orderItems.product").populate('user');
        for (let i = 0; i < data.orderItems.length; i++) {
          const item = data.orderItems[i];
          const product = item.product;

          await Product.findOneAndUpdate(
            { _id: product._id },
            { quantity: product.quantity - item.qty },
            { new: false }
          );
        }

        return NextResponse.json({ success: true, data });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the order status. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "No permission to update order status." });
    }
  } catch (error) {
    console.log('Error in updating order status:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}