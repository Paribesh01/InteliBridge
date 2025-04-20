import { Request, Response } from "express";
import axios from "axios";
let octokit: any;
async function main() {
  const { Octokit } = await import("octokit");
  octokit = Octokit;
}
main();
import prisma from "../db";
import { giveoauthurl } from "../helpers/giveOauthurl";
import dotenv from "dotenv";
import { createWebhookHelper } from "../helpers/createWebhook";
import { giveAccessToken } from "../helpers/giveAcessTokenurl";
dotenv.config();

export const isAuth = async (req: Request, res: Response) => {
  const { id, app } = req.params;
  const workflow = await prisma.workflow.findUnique({ where: { id } });
  const trigger = await prisma.trigger.findUnique({ where: { id } });

  if (workflow) {
    if (workflow.accessToken) {
      res.send({ isAuth: true });
    } else {
      res.send({ isAuth: false });
    }
  } else if (trigger) {
    if (trigger.accessToken) {
      res.send({ isAuth: true });
    } else {
      res.send({ isAuth: false });
    }
  } else {
    res.send({ isAuth: false });
  }
};

export const OAuth = async (req: Request, res: Response) => {
  console.log("here");
  const { app, id } = req.params;

  try {
    // if (app == "github") {
    //   redirectUri = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${id}`;
    // } else {
    //   console.log("app is not there in our system");
    //   res.send("invalid app");
    // }
    const redirect_uri = await giveoauthurl(app as string, id as string);

    console.log(redirect_uri);
    res.json({ redirectUrl: redirect_uri });
  } catch {}
};

export const callback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { app } = req.params;

  if (!code) {
    res.status(400).send("Code not provided");
  }

  try {
    console.log("1 ", code);
    const response = await giveAccessToken(app as string, code as string);

    const { access_token, refresh_token, ...others } = response;
    console.log("State:", state);
    console.log("Access Token:", access_token);

    const workflow = await prisma.workflow.findUnique({
      where: { id: state as string },
    });

    if (!workflow) {
      const trigger = await prisma.trigger.findUnique({
        where: { id: state as string },
      });

      if (!trigger) {
        console.log("No app is there");
        res.status(404).send("No app found");
      } else {
        await prisma.trigger.update({
          where: { id: state as string },
          data: {
            accessToken: access_token,
            refreshToken: refresh_token || "",
            metaData: {
              ...(trigger.metaData as object),
              ...others,
            },
          },
        });
        console.log("Trigger updated successfully");
      }
    } else {
      await prisma.workflow.update({
        where: { id: state as string },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token || "",
          metaData: {
            ...(workflow.metaData as object),
            ...others,
          },
        },
      });
      console.log("Workflow updated successfully");
    }
    res.send("Done, you may close this window");
  } catch (error: any) {
    console.error("Error during OAuth exchange:", error);
    res
      .status(500)
      .send(error.message || "An error occurred during the OAuth process");
  }
};

export const createWebhook = async (req: Request, res: Response) => {
  const { app } = req.params;
  const { id, zapid } = req.body;

  const flow = await prisma.trigger.findUnique({ where: { id } });
  const zap = await prisma.zap.findUnique({ where: { id: zapid } });

  console.log(flow?.accessToken);

  const resp = await createWebhookHelper(
    app as string,
    flow?.accessToken as string,
    flow?.metaData as any,
    zapid as string,
    req.user?.userId as string
  );
  // if (app == "github") {
  //   const client = new octokit({ auth: flow?.accessToken });
  //   const response = await client.request("POST /repos/Paribesh01/2d-Metaverse/hooks",{
  //     owner: "Paribesh01",
  //     repo: "2d-Metaverse",
  //     active: true,
  //     events: ["issues"],
  //     config: {
  //       url: `https://386d-59-145-142-18.ngrok-free.app/${app}/${zap?.id}/${flow?.id}`,
  //       content_type: "json",
  //       insecure_ssl: "0",
  //       secret: "your-webhook-secret",
  //     },
  //   });
  console.log(resp);
  console.log("Web hook is created...");

  const newzap = await prisma.trigger.update({
    where: { id },
    data: {
      set: true,
    },
  });

  // } else {
  //   console.log("app is not supprted ");

  // }

  res.send("webhook is created ");
};
