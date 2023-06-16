import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ success: true, message: "Category ID is Required" });
      }

      const deleteData = await Category.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Category Deleted successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to Delete the category. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in deleting a category:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
