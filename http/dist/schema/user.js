"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginSchema = exports.UserSignupSchema = void 0;
const zod_1 = require("zod");
exports.UserSignupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username should be more then 3 letter")
        .max(20, "Username should be less then 20 letter"),
    email: zod_1.z.string()
        .email("Invalid Email")
        .max(100, "Email is too long"),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character')
});
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email("Invalid Email")
        .max(100, "Email is too long"),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character')
});
