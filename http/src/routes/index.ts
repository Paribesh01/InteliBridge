
import express from "express";
import userRoute from "./user";

const router = express.Router()


router.use("/auth",userRoute);



export default router;