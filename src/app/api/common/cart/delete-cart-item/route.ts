import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Cart from "@/model/Cart";
import connectDB from "@/DB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ success: true, message: "Cart item ID is required." });
      }

      const findCart = await Cart.find({ _id: id });
      if (!findCart) {
        return NextResponse.json({ status: 204, success: false, message: 'No cart item found.' });
      }

      const userID = findCart[0].user._id;

      const deleteData = await Cart.findByIdAndDelete(id);

      if (deleteData) {
        const getData = await Cart.find({ user: userID }).populate('product');
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ success: false, message: "Failed to remove the cart item. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in removing a cart item:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
