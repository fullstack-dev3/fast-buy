import { NextResponse } from "next/server";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export async function GET(req: Request) {
  try {
    await connectDB();

    const getData = await Product.find({});

    if (getData) {
      return NextResponse.json(getData,{ status : 200 });
    } else {
      return NextResponse.json({status: 204 , success: false, message: 'No categories found.' });
    }
  } catch (error) {
    console.log('Error in getting all categories:', error);
    return NextResponse.json({status : 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}