import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export async function POST(req: Request) {
  await connectDB();
  const isAuthenticated = await AuthCheck(req);

  if (isAuthenticated === 'admin') {
    const data = await req.json();
    const saveData  =  await Category.create(data);

    if (saveData) {
      return NextResponse.json({ success : true, message: "Category Added Successfully !" });
    }
  } else {
    return NextResponse.json({ success: false , message: "You are not Authorized" });
  }
}
