import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getJwtToken = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("token", token);
  return {};
  return jwt.sign(token, process.env.NEXTAUTH_SECRET as string);
};
