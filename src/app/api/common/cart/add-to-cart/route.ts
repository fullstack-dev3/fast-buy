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

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const data = await req.json();
      const { user, product } = data;
      let { quantity } = data;

      const { error } = AddToCart.validate({ user, product, quantity });
      if (error) {
        return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
      }

      let saveData;

      const findCart = await Cart.find({ user, product });
      if (findCart?.length > 0) {
        quantity += findCart[0].quantity;

        saveData = await Cart.findOneAndUpdate({ user, product }, { quantity });
      } else {
        saveData = await Cart.create(data);
      }
      
      if (saveData) {
        return NextResponse.json({ success: true, message: "Product added to Cart!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add product to cart. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized Please login!" });
    }
  } catch (error) {
    console.log('Error in adding a product to cart :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
