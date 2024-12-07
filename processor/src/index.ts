import { PrismaClient } from "@prisma/client";
import {createClient} from "redis"


const client= new PrismaClient()

async  function  main() {
    const redisClient  = createClient()
    redisClient.connect().then(() => console.log("Connected to Redis"));
    
    while(1){
        const zaps = await client.webhookZap.findMany({
            where :{},
            take: 10
        })
        console.log("webhook found")
        console.log(zaps)
       zaps.map(async(zap)=>{
        await redisClient.rPush("zap", JSON.stringify(zap.id));
        console.log("sent by the redis", zap)
        await client.webhookZap.delete({where:{
            id:zap.id
        }})
       })

       await new Promise(r => setTimeout(r, 3000));

        
    
    }


}


main();