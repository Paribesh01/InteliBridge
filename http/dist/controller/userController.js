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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signup = exports.Login = void 0;
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            res.status(400).json({ message: 'Invalid email or password' });
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (user && isPasswordValid) {
            const token = jsonwebtoken_1.default.sign({
                userId: user === null || user === void 0 ? void 0 : user.id,
                email: user === null || user === void 0 ? void 0 : user.email,
            }, process.env.JSONSECRET, { expiresIn: "4h" });
            res.send({ token });
        }
        else {
            res.json({ message: "email or password is wrong" }).status(401);
        }
    }
    catch (e) {
        res.send("Something went wrong").status(500);
        console.log(e);
    }
});
exports.Login = Login;
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    try {
        const existingUser = yield db_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser)
            res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
            },
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (e) {
        console.log(e);
        res.send("Something went wrong").status(500);
    }
});
exports.Signup = Signup;
