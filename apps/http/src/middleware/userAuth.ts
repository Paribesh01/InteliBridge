
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}
export const authenticateToken = () => {
  return  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
       res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token as string, "FADSF$AFGC%EHR^H6vRHR^vh^E%H6e5vHE%VH^E%" as string, (err, user:any) => {
      if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
      req.user = user;
      next();
    });

  }}

  