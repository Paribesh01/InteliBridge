import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
require("dotenv").config({ path: "../../.env" });

export const authenticateToken = () => {
  const base64Secret = process.env.JSONSECRET as string; // Base64 encoded secret
  const secret = Buffer.from(base64Secret, "base64"); // Decoded secret as a Buffer


  if (!secret) {
    throw new Error("Secret not found");
  }



  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];


    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }
    jwt.verify(
      token as string,
      base64Secret, 
      (err, user: any) => {
        if (err) {
          console.error("Token verification error:", err);
          res.status(403).json({ message: "Forbidden: Invalid token" });
          return;
        }
        console.log("user in middleware", user);
        (req as any).user = user;
        console.log("token verified successfully");
        next();
      }
    );
    



  };
};
