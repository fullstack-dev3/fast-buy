import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const saveData  =  await Category.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Category added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the category. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
