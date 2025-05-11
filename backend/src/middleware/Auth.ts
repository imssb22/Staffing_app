import prismaClient from "../db/db";
import { Request, Response, NextFunction, json } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Developer, User } from "../interfaces"; // Make sure this matches your actual type

interface DeveloperRequest extends Request {
    developer?: Developer;
}
interface UserRequest extends Request {
    user?: User;
}

dotenv.config();
export const userAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    const token = req.headers.authorization;
    if (!token) {
        return void res.status(400).json({
            error: "jwt not present",
        });
    }
    try {
        const decoded = jwt.verify(
            token, //@ts-ignore
            process.env.USER_JWT_SECRET
        );
        const user: User | null = await prismaClient.user.findFirst({
            where: {
                id: decoded.userId,
            },
        });
        if (!user) {
            return void res.status(400).json({
                error:
                    "This is a authenticated endpoint and you are not authorized to view this w/o signin/signup",
            });
        }
        (req as UserRequest).user = user;
        next();
    } catch (error) {
        return void res.status(400).json({
            message: "Json webtoken invalid",
        });
    }
};

export const devAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return void res.status(400).json({
                error: "jwt not present",
            });
        }
        const decoded = jwt.verify(
            token, //@ts-ignore
            process.env.DEV_JWT_SECRET
        );
        const developer: Developer | null = await prismaClient.developer.findFirst({
            where: {
                id: decoded.userId,
            },
        });
        if (!developer) {
            return void res.status(400).json({
                error:
                    "This is a authenticated endpoint and you are not authorized to view this w/o signin/signup",
            });
        }

        (req as DeveloperRequest).developer = developer;
        next();
    } catch (error) {
        return void res.status(400).json({
            message: "Json webtoken invalid",
        });
    }
};
