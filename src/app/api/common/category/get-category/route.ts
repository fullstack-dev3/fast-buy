import { NextResponse } from "next/server";
import Category from "@/model/Category";
import connectDB from "@/DB/connectDB";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({status: 400 , success: false, message: 'Please provide category id.' });
    }

    await connectDB();

    const getData = await Category.findById(id);

    if (getData) {
      return NextResponse.json({success: true , data: getData});
    } else {
      return NextResponse.json({status: 204 , success: false, message: 'No category found.' });
    }
  } catch (error) {
    console.log('Error in getting category by id:', error);
    return NextResponse.json({status : 500 , success: false, message: error });
  }
}
