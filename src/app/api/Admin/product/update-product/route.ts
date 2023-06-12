import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const {
        _id,
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

      const saveData = await Product.findOneAndUpdate({ _id }, {
        name,
        description,
        image,
        fileName,
        quantity,
        slug,
        price,
        featured,
        category
      }, { new: true });

      if (saveData) {
        return NextResponse.json({ success: true, message: "product  updated successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the product . Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in update a new product :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
