import { PrismaClient } from "@prisma/client";
import redis from "redis"


const client= new PrismaClient()

async  function  main() {
    const redisClient  = redis.createClient()
    redisClient.connect().then(() => console.log("Connected to Redis"));
    
    while(1){
        const zaps = await client.webhookZap.findMany({
            where :{},
            take: 10
        })
       zaps.map(async(zap)=>{
        await redisClient.rPush("zap", JSON.stringify(zap.id));
        await client.webhookZap.delete({where:{
            id:zap.id
        }})
       })

       await new Promise(r => setTimeout(r, 3000));

        
    
    }


}


main();