import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {_id, name, description, slug} = data;

      const saveData = await Category.findOneAndUpdate({ _id }, {name, description, slug}, { new: true });
      if (saveData) {
        return NextResponse.json({ success: true, message: "Category updated successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the category. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "No permission to update the category." });
    }
  } catch (error) {
    console.log('Error in updating a category:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
