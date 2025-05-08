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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const Auth_1 = require("../middleware/Auth");
const cookieParser = require('cookie-parser');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = __importDefault(require("openai"));
const openaiClient = new openai_1.default({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
const db_1 = __importDefault(require("../db/db"));
const router = express_1.default.Router();
const SKILL_SCHEMA = zod_1.default.object({
    name: zod_1.default.string(),
    proficiency: zod_1.default.string()
});
const PROJECT = zod_1.default.object({
    name: zod_1.default.string(),
    roomid: zod_1.default.string().optional(),
    budget: zod_1.default.number().multipleOf(0.1),
    timeline: zod_1.default.number(),
    required_developers: zod_1.default.number(),
    skills: zod_1.default.array(SKILL_SCHEMA),
    Assigned_developers: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.string(),
        name: zod_1.default.string(),
        YOE: zod_1.default.number().multipleOf(0.1),
        email: zod_1.default.string().email(),
        phone: zod_1.default.string(),
        password: zod_1.default.string(),
        rating: zod_1.default.number().multipleOf(0.1),
        hrate: zod_1.default.number()
    }))
});
const USER_BODY = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    company: zod_1.default.string(),
    password: zod_1.default.string(),
    phone: zod_1.default.string(),
    rating: zod_1.default.number().multipleOf(0.01).optional(),
});
const SIGNINBODY = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedUser = USER_BODY.safeParse(req.body);
    if (!parsedUser.success) {
        return void res.status(400).json({ error: "Invalid user data" });
    }
    try {
        const user = yield db_1.default.user.create({
            data: {
                name: parsedUser.data.name,
                email: parsedUser.data.email,
                company: parsedUser.data.company,
                password: parsedUser.data.password,
                phone: parsedUser.data.phone,
                rating: parsedUser.data.rating,
            },
        });
        const role = "client";
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, 
        //@ts-ignore
        process.env.USER_JWT_SECRET);
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
        res.cookie('userId', user.id, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });
        return void res.status(200).json({
            token: token,
            role: role,
            userId: user.id,
            username: user.name
        });
    }
    catch (error) {
        return void res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/info", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return void res.status(202).json(req.user);
    }
    catch (e) {
        console.log(e);
        return void res.status(504).json({
            message: "Cant fetch info"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSignin = SIGNINBODY.safeParse(req.body);
    if (!parsedSignin.success) {
        return void res.status(400).json({
            error: "Inputs format not correct should be handled in frontend itself",
        });
    }
    const user = yield db_1.default.user.findFirst({
        where: {
            email: parsedSignin.data.email,
        },
    });
    if (!user) {
        return void res.status(400).json({
            error: "You are not signedup yet",
        });
    }
    if (user.password === parsedSignin.data.password) {
        const role = "client";
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, 
        //@ts-ignore
        process.env.USER_JWT_SECRET);
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
            userId: user.id,
            username: user.name
        });
    }
    return void res.status(400).json({
        error: "Please check your email or password",
    });
}));
router.post("/addproject", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body)
    var _a;
    const parsedProject = PROJECT.safeParse(req.body);
    if (!parsedProject.success) {
        return void res.status(400).json({
            message: "Invalid inputs",
        });
    }
    const created_by = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (created_by) {
            const room = yield db_1.default.room.create({
                data: {
                    admin: created_by,
                },
            });
            if (room) {
                const project = yield db_1.default.project.create({
                    data: {
                        name: parsedProject.data.name,
                        roomid: room.Roomid,
                        created_by: created_by,
                        budget: parsedProject.data.budget,
                        timeline: parsedProject.data.timeline,
                        required_developers: parsedProject.data.required_developers,
                        Assigned_developers: {
                            connect: parsedProject.data.Assigned_developers.map((developer) => ({
                                id: developer.id
                            }))
                        }
                    },
                });
                const skills = req.body.skills;
                const projectId = project.id;
                try {
                    if (!Array.isArray(skills)) {
                        return void res.status(400).json({
                            message: "The input skills must be an array"
                        });
                    }
                    let valid = true;
                    skills.forEach((skill) => {
                        if (!skill.name || !skill.proficiency) {
                            valid = false;
                        }
                    });
                    if (!valid) {
                        return void res.status(400).json({
                            message: "Some Skill is empty"
                        });
                    }
                    const projectskills = yield db_1.default.projectSkill.createMany({
                        data: skills.map((skill) => ({
                            project_id: projectId,
                            name: skill.name,
                            proficiency: skill.proficiency,
                        })),
                    });
                    return void res.status(200).json({
                        message: project,
                        room: room,
                        skills: projectskills
                    });
                }
                catch (error) {
                    console.log(error, "ERR");
                    return void res.status(511).json({
                        message: "Something went wrong",
                    });
                }
            }
            else {
                return void res.status(400).json({
                    message: "Room not created hence project not created",
                });
            }
        }
        else {
            return void res.status(400).json({
                message: "Relogin as created by not available",
            });
        }
    }
    catch (error) {
        console.log(error);
        return void res.status(400).json({
            error: error,
        });
    }
}));
router.put("/edit/:field", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const field = req.params.field;
    const change = req.body.change;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const data = yield db_1.default.user.update({
            where: { id: userId },
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
router.get("/myprojects", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const username = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
    try {
        const projects = yield db_1.default.user.findMany({
            where: { id: userId },
            select: {
                name: true,
                projects: true
            }
        });
        // const assigneddevs = await prismaClient.project.
        const response = {
            username: projects[0].name,
            projects: projects[0].projects
        };
        // console.log(response)
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
router.post("/llm", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body.input;
    try {
        const devs = yield db_1.default.developer.findMany({
            select: {
                id: true,
                name: true,
                YOE: true,
                // rating : true,
                // schedule : true,
                // hourly_rate : true,
                skills: true
            }
        });
        // console.log(devs)
        const prompt = `
      context : ${input}
      
      Deduce the budget, duration, and the kind of project the user wants to build from the context
      provided. Below is the list of available developers. Scan through them and retrieve the relevant 
      information. If the context contains the tech stack to be used explicitly then only select those
      developers with the given data. If the context contains minimum proficiency and/or minimum rating 
      then also put the relevant filter while selecting the developers
      
      Here is the list of the developers to choose from:
      Available developer : ${devs.map((d) => ` -> (Id : ${d.id}): Skills: ${d.skills.map(skill => `${skill.name} + ${skill.proficiency}`).join(", ")}, Name: ${d.name}, YOE: ${d.YOE}`).join("\n")}
      
      Based on the context and the dev list choose and suggest
      - The most suitable tech stack
      - The number and type of developers needed
      - The best team composition from the available developers, considering their skills, 
        proficiency, and hourly rates (assume 8 hours/day work)
      - Ensure the total cost fits within the budget and the project can be completed 
        in the given duration

        Return your reasoning, the suggested tech stack, and the selected developers 
        (with their names) as a JSON array in a field called "retrievedList". Example:. 
        { "name": "Example project",
          "timeline": 30 (number),
          "budget": 1000 (number),
          "skills": [{name: React.js,
                     proficiency: begineer}, 
                     {name: Typescript,
                     proficiency: expert}],
          "retrievedList": [
              { "id": "dev1", "name": "Alice", "skills": ["React", "Node.js"], "YOE": 5 }
          ]
      }

      `;
        const response = yield openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }]
        });
        const outputText = response.choices[0].message.content;
        // Try to extract JSON from the LLM output
        let retrievedList = {};
        let timeline = 1;
        let budget = 1000;
        let skills = {};
        let name = "goodname";
        try {
            if (!outputText) {
                throw new Error("Output text is null or undefined");
            }
            const jsonStart = outputText.indexOf('{');
            const jsonEnd = outputText.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = outputText.substring(jsonStart, jsonEnd + 1);
                timeline = JSON.parse(jsonString).timeline;
                budget = JSON.parse(jsonString).budget;
                skills = JSON.parse(jsonString).skills;
                name = JSON.parse(jsonString).name;
                retrievedList = JSON.parse(jsonString).retrievedList;
            }
        }
        catch (e) {
            console.log("Failed to parse retrievedList from LLM output");
        }
        // console.log(prompt, "\n \n");
        // console.log(outputText, "\n \n");
        // console.log( retrievedList)
        // console.log("budget " + budget )
        // console.log("timeline " + timeline)
        // console.log("Skills: " + skills)
        // console.log("name: " + name)
        return void res.status(200).json({ timeline, budget, retrievedList, name, skills });
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Something went wrong"
        });
    }
}));
// router.post("addmanual", userAuth, async(req, res) => {
//     const 
// })
router.post("/getdevs", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const developers = yield db_1.default.developer.findMany({
            where: {
                id: {
                    in: ids // Use the 'in' operator for array of IDs
                }
            }
        });
        // console.log(developers);
        return void res.status(200).json(developers);
    }
    catch (error) {
        console.log(error);
        return void res.status(511).json({
            message: "Something went wrong"
        });
    }
}));
router.get("/devinfo/:id", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const devId = req.params.id;
    try {
        const dev = yield db_1.default.developer.findFirst({
            where: { id: devId }
        });
        if (dev) {
            return void res.status(200).json(dev);
        }
    }
    catch (e) {
        console.log("ERR", e);
        return void res.status(511).json({
            message: "Could'nt get the data",
        });
    }
}));
router.post("/assigneddevs", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        // console.log(ids)
        const developers = yield db_1.default.project.findMany({
            where: {
                id: {
                    in: ids // Use the 'in' operator for array of IDs
                }
            },
            select: {
                Assigned_developers: true
            }
        });
        // console.log(developers);
        return void res.status(200).json(developers);
    }
    catch (error) {
        console.log(error);
        return void res.status(511).json({
            message: "Something went wrong"
        });
    }
}));
exports.default = router;
