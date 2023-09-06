import Favorite from "@/model/Favorite";
import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import connectDB from "@/DB/connectDB";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: 400, success: false, message: 'Please Login!' });
    }

    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Favorite.find({ user: id }).populate('user').populate('product');

      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No favroite found.' });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in getting favorite:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
