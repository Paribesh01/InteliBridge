"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const client = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = (0, redis_1.createClient)();
        redisClient.connect().then(() => console.log("Connected to Redis"));
        while (1) {
            const zaps = yield client.webhookZap.findMany({
                where: {},
                take: 10
            });
            console.log("webhook found");
            console.log(zaps);
            zaps.map((zap) => __awaiter(this, void 0, void 0, function* () {
                yield redisClient.rPush("zap", JSON.stringify(zap.id));
                console.log("sent by the redis", zap);
                yield client.webhookZap.delete({ where: {
                        id: zap.id
                    } });
            }));
            yield new Promise(r => setTimeout(r, 3000));
        }
    });
}
main();
