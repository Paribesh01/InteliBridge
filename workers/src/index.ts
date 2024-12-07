import { PrismaClient } from "@prisma/client";
import {createClient} from "redis"
import { SendMail } from "./email";


const redisClient = createClient();


const client  = new PrismaClient();


(async () => {
    await redisClient.connect();
  
    console.log("Worker started. Waiting for tasks...");
  
    while (true) {
        const task:any = await redisClient.blPop("zap", 0); 
        console.log("task is in the worker boy", task)
  
        const zapDetails = await  client.webhookZap.findUnique({where:{
            id:task.element
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

    SendMail("nepalparibesh01@gmail.com","Hey","this is a test message ")


    console.log("this is the Zap Details")
    console.log(zapDetails)



    }
  })();