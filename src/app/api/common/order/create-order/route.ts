import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Cart from "@/model/Cart";
import Order from "@/model/Order";
import connectDB from "@/DB/connectDB";
import Joi from "joi";

const createOrderSchema = Joi.object({
  user: Joi.string().required()
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const data = await req.json();
      const { user } = data;

      const { error } = createOrderSchema.validate({ user });
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g, '')
        });
      }

      const saveData = await Order.create(data);

      if (saveData) {
        await Cart.deleteMany({ user });
        return NextResponse.json({ success: true, message: "Products are ordered successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to create order. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in creating order:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}