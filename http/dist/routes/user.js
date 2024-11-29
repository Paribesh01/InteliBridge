"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateData_1 = require("../middleware/ValidateData");
const user_1 = require("../schema/user");
const userController_1 = require("../controller/userController");
const userRoute = express_1.default.Router();
userRoute.post("/login", (0, ValidateData_1.validateSchema)(user_1.UserLoginSchema), userController_1.Login);
userRoute.post("/signup", (0, ValidateData_1.validateSchema)(user_1.UserLoginSchema), userController_1.Signup);
exports.default = userRoute;
