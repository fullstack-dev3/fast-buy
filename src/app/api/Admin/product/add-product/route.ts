import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";
import Joi from "joi";

const ProductSchema  = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  fileName: Joi.string().required(),
  quantity: Joi.number().required(),
  slug: Joi.string().required(),
  price: Joi.number().required(),
  featured: Joi.boolean().required(),
  category: Joi.required()
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const data = await req.json();

      const {
        name,
        description,
        image,
        fileName,
        quantity,
        slug,
        price,
        featured,
        category
      } = data;

      const { error } = ProductSchema.validate({
        name,
        description,
        image,
        fileName,
        quantity,
        slug,
        price,
        featured,
        category
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g, '')
        });
      }

      const saveData = await Product.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Product added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the product. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "No permission to add the product." });
    }
  } catch (error) {
    console.log('Error in adding a new Product:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
