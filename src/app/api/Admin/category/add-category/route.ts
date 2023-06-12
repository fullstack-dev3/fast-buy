import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";
import Joi from "joi";

const CategorySchema  = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  fileName: Joi.string().required(),
  slug: Joi.string().required()
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const { name, description, image, fileName, slug } =  data;
      
      const { error } = CategorySchema.validate({
        name, description, image, fileName, slug
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g, '')
        });
      }

      const saveData = await Category.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Category added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the category. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new category:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
