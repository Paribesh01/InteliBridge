import client from "@repo/db";
import { createClient } from "redis";
import { SendMail } from "./email";

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path: "../../.env" })
}


async function sleep(ms: number) {
  console.log("Worker starting...", process.env.REDIS_URL);

  if (!process.env.REDIS_URL) {
    throw new Error("Please set REDIS_URL in the environment variable");
  }

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  await redisClient.connect();

  console.log("Worker started. Waiting for tasks...");

  while (true) {
    const task: any = await redisClient.blPop("zap", 0);
    console.log("task is in the worker boy", task);

    const zapDetails = await client.webhookZap.findUnique({
      where: {
        id: task.element,
      },
      select: {
        zap: {
          include: {
            workflows: {
              include: {
                type: true,
              },
            },
          },
        },
      },
    });

    SendMail("nepalparibesh01@gmail.com", "Hey", "this is a test message ");

    console.log("this is the Zap Details");
    console.log(zapDetails);
  }
}

sleep(200);
