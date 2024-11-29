import { Express,Request,Response } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
export const Login =  async (req:Request, res:Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if(!user)
         res.status(400).json({ message: 'Invalid email or password' });

      
      const isPasswordValid = await bcrypt.compare(password, user?.password as string);

      if (user && isPasswordValid) {
        const token = jwt.sign(
          {
            userId: user?.id,
            email: user?.email,
          },
          process.env.JSONSECRET as string,
          { expiresIn: "4h" }
        );
        res.send({ token });
      } else {
        res.json({message:"email or password is wrong"}).status(401);
      }
    } catch (e) {
      res.send("Something went wrong").status(500);
  
      console.log(e);
    }
  }
  export const Signup = async (req:Request, res: Response) => {
    const { email, name, password } = req.body;
  try{
  
      const existingUser = await prisma.user.findUnique({
          where: {
              email,
          },
      });
      if (existingUser)
          res.status(400).json({ message: "User already exists" });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
          data: {
              name,
              password:hashedPassword,
              email,
          },
      });
      
      res.status(201).json({ message: "User registered successfully" });
  }catch(e){
      console.log(e);
      res.send("Something went wrong").status(500)
  }
  }