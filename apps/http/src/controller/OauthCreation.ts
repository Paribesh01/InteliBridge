import { Request, Response } from "express";
import axios from "axios";
let octokit:any
async function main() {
  const { Octokit } = await import("octokit");
  octokit = Octokit
}
main();import prisma from "../db";



const client_id = "Ov23liMWJKFCyMm9y9WR"
const clientSecret = "3fbc79456d11b522c5c235d06bd8ff8cfe3342f0";
const redirect_uri = "http://localhost:8000/api/v1/o/github/callback"

export const OAuth = (req: Request, res: Response) => {
  console.log("here")
  const { app,id } = req.params;
  let redirectUri;
  try {
    if (app == "github") {
      redirectUri = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${id}`;
    } else {
      console.log("app is not there in our system");
      res.send("invalid app");
    }

    res.redirect(redirectUri as string);
  } catch {}
};

export const callback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { app } = req.params;
  console.log("here to")
  if (!code) {
    res.status(400).send("Code not provided");
  }

  try {
    let response;
    if (app == "github") {
      response = await axios.post(
        "https://github.com/login/oauth/access_token",
        null,
        {
          params: {
            client_id: client_id,
            client_secret: clientSecret ,
            code,
            redirect_uri:redirect_uri,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

    }
    const { access_token, refresh_token } = response?.data as any;
    console.log(state)
    console.log(access_token)
    const workflow = await prisma.workflow.findUnique({
      where: { id: state as string },
    });

    if (!workflow) {
      // If no workflow is found, check for a trigger
      const trigger = await prisma.trigger.findUnique({
        where: { id: state as string },
      });

      if (!trigger) {
        console.log("No app is there");
      } else {
        // Update the trigger with tokens
        await prisma.trigger.update({
          where: { id: state  as string },
          data: {
            accessToken: access_token,
            refreshToken: refresh_token || "",
          },
        });
        console.log("Trigger updated successfully");
      }
    } else {
      // Update the workflow with tokens
      await prisma.workflow.update({
        where: { id: state as string},
        data: {
          accessToken: access_token,
          refreshToken: refresh_token || "",
        },
      });
      console.log("Workflow updated successfully");
    }
    res.send("done")
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const createWebhook = async (req: Request, res: Response) => {
  const { app } = req.params;
  const { id, zapid } = req.body;

  const flow = await prisma.trigger.findUnique({ where: { id } });
  const zap = await prisma.zap.findUnique({ where: { id: zapid } });

  console.log(flow?.accessToken)
  if (app == "github") {
    const client = new octokit({ auth: flow?.accessToken });
    const response = await client.request("POST /repos/Paribesh01/2d-Metaverse/hooks",{
      owner: "Paribesh01",
      repo: "2d-Metaverse",
      active: true,
      events: ["issues"],
      config: {
        url: `https://386d-59-145-142-18.ngrok-free.app/${app}/${zap?.id}/${flow?.id}`,
        content_type: "json",
        insecure_ssl: "0",
        secret: "your-webhook-secret",
      },
    });
    console.log("Web hook is created...");
  } else {
    console.log("app is not supprted ");

  }

  res.send("webhook is created ");
};
