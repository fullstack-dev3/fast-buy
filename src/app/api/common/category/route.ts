import { NextResponse } from "next/server";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export const dynamic  = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();

    const getData = await Category.find({});
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
