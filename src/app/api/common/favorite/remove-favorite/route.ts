import Favorite from "@/model/Favorite"
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Favorite item ID is required." });

      const deleteData = await Favorite.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Favorite item removed successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to remove the favorite item. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in deleting a favorite item:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}