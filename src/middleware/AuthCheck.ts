import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const AuthCheck = async (req: Request) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return false;
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET ?? 'default_secret_dumbScret') as JwtPayload;
    if (decoded) {
      return decoded?.role;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export default AuthCheck;
