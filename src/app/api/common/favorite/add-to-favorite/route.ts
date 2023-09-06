import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Favorite from "@/model/Favorite";
import connectDB from "@/DB/connectDB";
import Joi from "joi";

const favorite = Joi.object({
  user: Joi.string().required(),
  product: Joi.string().required()
});

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const data = await req.json();
      const { user, product } = data;

      const { error } = favorite.validate({ user, product });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g, '')
        });
      }

      const saveData = await Favorite.create(data);
      if (saveData) {
        return NextResponse.json({ success: true, message: "Product was added to Favourites!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add product to Favourites. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
      console.log('Error in adding a product to favorite:', error);
      return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}