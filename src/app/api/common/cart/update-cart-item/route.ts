import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Cart from "@/model/Cart";
import connectDB from "@/DB/connectDB";
import Joi from "joi";

const AddToCart = Joi.object({
  user: Joi.string().required(),
  product: Joi.string().required(),
  quantity: Joi.number().required(),
});

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const data = await req.json();
      const { user, product, quantity } = data;

      const { error } = AddToCart.validate({ user, product, quantity });
      if (error) {
        return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
      }

      const saveData = await Cart.findOneAndUpdate({ user, product }, { quantity });
      if (saveData) {
        const getData = await Cart.find({ user }).populate('product');
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the cart. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in update a cart:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
