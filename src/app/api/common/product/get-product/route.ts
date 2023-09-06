import { NextResponse } from "next/server";
import Product from "@/model/Product";
import connectDB from "@/DB/connectDB";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: 400 , success: false, message: 'Category ID is required.' });
    }

    await connectDB();

    const getData = await Product.findById(id).populate('category' ,' name slug _id')
      
    if (getData) {
      return NextResponse.json({ success :true , data: getData });
    } else {
      return NextResponse.json({ status: 204 , success: false, message: 'No product found.' });
    }
  } catch (error) {
    console.log('Error in getting product by id:', error);
    return NextResponse.json({ status: 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}
