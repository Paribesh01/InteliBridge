import express from "express";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";
import { giveoauthurl } from "./helpers/giveOauthurl";

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Use router for API routes
app.use("/api/v1", router);

// Use the environment variable for the port
const port = 8000; // Fallback to 8000 if PORT is not set

console.log(process.env.GithubclientID);

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  console.log(await giveoauthurl("github", "Fafadfadsf"));
});

// import path from 'path';

// const APPS_FOLDER = path.resolve(__dirname, 'apps');

// export const logDefaultFunctionFromAppFile = async (app:string, fileName:string) => {
//   try {
//     const filePath = path.join(APPS_FOLDER, app, `${fileName}.js`);
//     console.log('Attempting to load file from path:', filePath);

//     // Dynamically import the file
//     const module = await import(filePath);

//     // Check if the module has a default export function
//     if (!module.default || !module.default.default || typeof module.default.default !== 'function') {
//       throw new Error(
//         `No default function found in file "${fileName}" for app "${app}".`
//       );
//     }
//      // Get the function
//      const functionToRun = module.default.default;

//      // Run the function with the provided code
//      const result = await functionToRun();
//         console.log(result)
//     // Log the function's code
//     console.log(`Default export function code from "${fileName}" in app "${app}":\n`);
//     console.log(module.default.default.toString());
//   } catch (error) {
//     console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
//     throw error;
//   }
// };

// // Test the function with the "github" app and "oauth" file
// logDefaultFunctionFromAppFile('github', 'oauth');
