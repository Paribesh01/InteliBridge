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
const email_1 = require("./email");
const redisClient = (0, redis_1.createClient)();
const client = new client_1.PrismaClient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
    console.log("Worker started. Waiting for tasks...");
    while (true) {
        const task = yield redisClient.blPop("zap", 0);
        console.log("task is in the worker boy", task);
        const zapDetails = yield client.webhookZap.findUnique({ where: {
                id: task.element
            },
            select: {
                zap: {
                    include: {
                        workflows: {
                            include: {
                                type: true
                            }
                        }
                    }
                }
            }
        });
        (0, email_1.SendMail)("nepalparibesh01@gmail.com", "Hey", "this is a test message ");
        console.log("this is the Zap Details");
        console.log(zapDetails);
    }
}))();
