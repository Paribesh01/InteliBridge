import { PrismaClient } from "@prisma/client";
import redis from "redis"


const redisClient = redis.createClient();


const client  = new PrismaClient();


(async () => {
    await redisClient.connect();
  
    console.log("Worker started. Waiting for tasks...");
  
    while (true) {
        const task = await redisClient.blPop("myQueue", 0); 
        const id = JSON.parse(task.id);
  
        const zapDetails = await  client.webhookZap.findUnique({where:{
            id
        },
        select:{
            zap:{
                include:{
                    workflows:{
                        include:{
                            type:true
                        }
                    }
                }
            }
        }
    })
    console.log("this is the Zap Details")
    console.log(zapDetails)



    }
  })();