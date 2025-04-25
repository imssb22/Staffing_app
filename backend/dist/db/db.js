"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prismaClient = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
exports.default = prismaClient;
