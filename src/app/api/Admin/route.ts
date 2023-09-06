import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import Category from "@/model/Category";
import Product from "@/model/Product";
import Order from "@/model/Order";
import User from "@/model/User";
import connectDB from "@/DB/connectDB";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();

    const isAuthenticated = await AuthCheck(req);

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    if (isAuthenticated === 'admin') {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const firstDate = year + '-' + (month > 9 ? month : '0' + month) + '-01';

      const users = await User.find({ role: 'user' }).count();
      const products = await Product.find({}).count();
      const categories = await Category.find({}).count();
      const pendingOrders = await Order.find({ isDelivered: false }).count();
      const completedOrders = await Order.find({ isDelivered: true }).count();
      const monthOrders = await Order.find({ paidAt: { $gte: firstDate } }).count();

      const data = {
        users,
        products,
        categories,
        pendingOrders,
        completedOrders,
        monthOrders
      }

      return NextResponse.json({ data, status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "No permission to get admin data." });
    }
  } catch (error) {
    console.log('Error in getting admin data: ', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}