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
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const db_1 = __importDefault(require("../db/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookieParser = require('cookie-parser');
dotenv_1.default.config();
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
const DEVELOPER = zod_1.default.object({
    name: zod_1.default.string(),
    YOE: zod_1.default.number().multipleOf(0.1),
    email: zod_1.default.string(),
    phone: zod_1.default.string(),
    password: zod_1.default.string(),
    rating: zod_1.default.number().optional(),
    hrate: zod_1.default.number().optional()
});
const SIGNINBODY = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedDev = DEVELOPER.safeParse(req.body);
    if (!parsedDev.success) {
        return void res.status(400).json({
            error: "Invalid Format",
        });
    }
    try {
        const developer = yield db_1.default.developer.create({
            data: {
                name: parsedDev.data.name,
                YOE: parsedDev.data.YOE,
                email: parsedDev.data.email,
                phone: parsedDev.data.phone,
                password: parsedDev.data.password,
                hrate: 0, // Default value for hrate, adjust as needed
            },
        });
        if (!developer) {
            return void res.status(400).json({
                error: "Unable to create a record try after some time",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: developer.id,
        }, 
        //@ts-ignore
        process.env.DEV_JWT_SECRET);
        const role = "dev";
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        res.cookie('role', role, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        return void res.status(200).json({
            token: token,
            role: role,
            username: developer.name,
            userId: developer.id,
        });
    }
    catch (e) {
        console.log(e);
        return void res.status(200).json({
            message: "Something iswrong",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedsignin = SIGNINBODY.safeParse(req.body);
    if (!parsedsignin.success) {
        return void res.status(400).json({
            error: "Invalid Format",
        });
    }
    const developer = yield db_1.default.developer.findFirst({
        where: {
            email: parsedsignin.data.email,
        },
    });
    if (!developer) {
        return void res.status(400).json({
            error: "You are not signedup",
        });
    }
    if (developer.password === req.body.password) {
        const token = jsonwebtoken_1.default.sign({
            userId: developer.id,
        }, 
        //@ts-ignore
        process.env.DEV_JWT_SECRET);
        const role = "dev";
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        res.cookie('role', role, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        return void res.status(200).json({
            token: token,
            role: role,
            username: developer.name,
            userId: developer.id,
        });
    }
    return void res.status(400).json({
        error: "Inputs are incorrect please check your username and password",
    });
}));
router.get("/myprojects", Auth_1.devAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const developerId = (_a = req.developer) === null || _a === void 0 ? void 0 : _a.id;
    const developername = (_b = req.developer) === null || _b === void 0 ? void 0 : _b.name;
    try {
        const projects = yield db_1.default.developer.findMany({
            where: { id: developerId },
            select: {
                name: true,
                projects: true
            }
        });
        const response = {
            username: projects[0].name,
            projects: projects[0].projects
        };
        console.log(response);
        // projects[0].projects.
        return void res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Couldnt get the projects"
        });
    }
}));
router.put("/addskills", Auth_1.devAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const skills = req.body.skills;
    const devId = (_a = req.developer) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!Array.isArray(skills)) {
            return void res.status(400).json({ error: "Skills must be an array" });
        }
        let isValid = true;
        skills.forEach((skill) => {
            if (!skill.name || !skill.proficiency) {
                isValid = false;
            }
        });
        if (!isValid) {
            return void res.status(400).json({
                message: "Each skill must have a name and proficiency",
            });
        }
        yield db_1.default.skill.deleteMany({
            where: {
                developer_id: devId,
            },
        });
        const createdSkills = yield db_1.default.skill.createMany({
            data: skills.map((skill) => ({
                developer_id: devId,
                name: skill.name,
                proficiency: skill.proficiency,
            })),
        });
        return void res.status(200).json({
            message: "Skills added successfully",
            data: createdSkills,
        });
    }
    catch (e) {
        console.log(e, "ERR");
        return void res.status(511).json({
            message: "Something went wrong",
        });
    }
}));
router.get("/getskills", Auth_1.devAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const devId = (_a = req.developer) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const Skills = yield db_1.default.developer.findMany({
            where: { id: devId },
            select: { skills: true }
        });
        return void res.status(211).json(Skills);
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Couldnt get the skills"
        });
    }
}));
router.get("/info", Auth_1.devAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return void res.status(200).json(req.developer);
    }
    catch (e) {
        console.log("ERR", e);
        return void res.status(511).json({
            message: "Could'nt get the data",
        });
    }
}));
router.put("/edit/:field", Auth_1.devAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const field = req.params.field;
    const change = field === "YOE" ? Number(req.body.change) : req.body.change;
    const devId = (_a = req.developer) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const data = yield db_1.default.developer.update({
            where: { id: devId },
            data: {
                [field]: change,
            },
        });
        return void res.status(200).json({
            message: "Updated Successfully",
        });
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Failed to update",
        });
    }
}));
exports.default = router;
