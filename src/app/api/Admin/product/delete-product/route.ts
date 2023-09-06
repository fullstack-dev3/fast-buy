import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ success: true, message: "Product ID is Required" });
      }

      const deleteData = await Product.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Product deleted successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to delete the product. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "No permission to delete the product." });
    }
  } catch (error) {
    console.log('Error in deleting a product:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
