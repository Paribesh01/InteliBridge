import client from "@repo/db";
import { createClient } from "redis";

import dotenv from "dotenv";

require('dotenv').config({ path: "../../.env" })



async function main() {
  if (!process.env.REDIS_URL) {
    throw new Error("Please set REDIS_URL in the environment   variable");
  }

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().then(() => console.log("Connected to Redis"));

  while (1) {
    const zaps = await client.webhookZap.findMany({
      where: {},
      take: 10,
    });
    console.log("webhook found");
    console.log(zaps);
    zaps.map(async (zap) => {
      await redisClient.rPush("zap", JSON.stringify(zap.id));
      console.log("sent by the redis", zap);
      await client.webhookZap.delete({
        where: {
          id: zap.id,
        },
      });
    });

    await new Promise((r) => setTimeout(r, 3000));
  }
}

main();
