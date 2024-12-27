import express from "express";
import { validateSchema } from "../middleware/ValidateData";
import { UserLoginSchema, UserSignupSchema } from "../schema/user";
import { Login, Signup } from "../controller/userController";

const userRoute = express.Router();

userRoute.post("/login", validateSchema(UserLoginSchema),Login);

userRoute.post("/signup", validateSchema(UserLoginSchema), Signup);

export default userRoute;
