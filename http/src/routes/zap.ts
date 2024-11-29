import express from "express"
import { authenticateToken } from "../middleware/userAuth";


const ZapRouter  = express.Router()


ZapRouter.post("/",authenticateToken(),()=>{
    
})


export default ZapRouter;