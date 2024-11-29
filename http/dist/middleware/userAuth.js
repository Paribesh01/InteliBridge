"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (schema) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        jsonwebtoken_1.default.verify(token, process.env.JSONSECRET, (err, user) => {
            if (err)
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            req.user = user;
            next();
        });
    };
};
exports.authenticateToken = authenticateToken;
