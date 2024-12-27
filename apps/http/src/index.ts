import express from "express"
import cors from "cors"
import router from "./routes"

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api/v1",router)



app.listen(8000,()=>{
    console.log("Listiing on port 8000");
})