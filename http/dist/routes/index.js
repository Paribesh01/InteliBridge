"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const zap_1 = __importDefault(require("./zap"));
const trigger_1 = __importDefault(require("./trigger"));
const workflow_1 = __importDefault(require("./workflow"));
const router = express_1.default.Router();
router.use("/auth", user_1.default);
router.use("/zap", zap_1.default);
router.use("/trigger", trigger_1.default);
router.use("/workflow", workflow_1.default);
exports.default = router;
