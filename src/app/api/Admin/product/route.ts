import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export async function GET(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Product.find({});

      if (getData) {
        return NextResponse.json(getData,{ status : 200 });
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'No categories found.' });
      }
    } else {
      return NextResponse.json({status: 401 , success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in getting all categories:', error);
    return NextResponse.json({status : 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}