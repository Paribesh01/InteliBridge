import express from "express";
import cors from "cors";
import router from "./routes";
import dotenv from 'dotenv';
import { giveoauthurl } from "./helpers/giveOauthurl";

// Load environment variables from .env file
dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

// Use router for API routes
app.use("/api/v1", router);

// Use the environment variable for the port
const port = process.env.PORT || 8000 // Fallback to 8000 if PORT is not set

    console.log(process.env.GithubclientID)

    console.log(giveoauthurl("github","Fafadfadsf"))

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
