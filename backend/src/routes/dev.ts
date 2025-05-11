import express from "express";
import zod, { ParseStatus } from "zod";
import prismaClient from "../db/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const cookieParser = require('cookie-parser');
dotenv.config();
import { devAuth } from "../middleware/Auth";
import { Skill, Developer } from "../interfaces";
import { Request, Response } from "express";
interface DeveloperRequest extends Request {
    developer?: Developer;
}
const router = express.Router();
const DEVELOPER = zod.object({
    name: zod.string(),
    YOE: zod.number().multipleOf(0.1),
    email: zod.string(),
    phone: zod.string(),
    password: zod.string(),
    rating: zod.number().optional(),
    hrate: zod.number().optional()
});
const SIGNINBODY = zod.object({
    email: zod.string(),
    password: zod.string(),
});
router.post("/signup", async (req : DeveloperRequest, res) => {
    const parsedDev = DEVELOPER.safeParse(req.body);
    if (!parsedDev.success) {
        return void res.status(400).json({
            error: "Invalid Format",
        });
    }
    try{
        const developer = await prismaClient.developer.create({
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
        const token = jwt.sign(
            {
                userId: developer.id,
            },
            //@ts-ignore
            process.env.DEV_JWT_SECRET
        );
        const role = "dev"

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
            userId : developer.id,
        });
    }catch(e){
        console.log(e);
        return void res.status(200).json({
            message: "Something iswrong",
        });
    }
    
});
router.post("/signin", async (req : DeveloperRequest, res) => {
    const parsedsignin = SIGNINBODY.safeParse(req.body);
    if (!parsedsignin.success) {
        return void res.status(400).json({
            error: "Invalid Format",
        });
    }
    const developer = await prismaClient.developer.findFirst({
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
        const token = jwt.sign(
            {
                userId: developer.id,
            },
            //@ts-ignore
            process.env.DEV_JWT_SECRET
        );
        const role = "dev"

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
            username : developer.name,
            userId : developer.id,

        });
    }
    return void res.status(400).json({
        error: "Inputs are incorrect please check your username and password",
    });
});

router.get("/myprojects", devAuth, async (req, res) => {
    const developerId = (req as any).developer?.id;
    const developername = (req as any).developer?.name;
    try {
        const projects = await prismaClient.developer.findMany({
            where: { id: developerId },
            select : {
              name : true,
              projects : true}
        })
        const response = {
          username: projects[0].name,
          projects: projects[0].projects
      };
        console.log(response)
        // projects[0].projects.
        return void res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Couldnt get the projects"
        })
    }
  
  });

router.put("/addskills", devAuth, async (req: DeveloperRequest, res: Response) => {
    
    const skills: Skill[] = req.body.skills as {
        name: string;
        proficiency: string;
        developer_id: string;
    }[];
    const devId = (req as any).developer?.id;
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
        await prismaClient.skill.deleteMany({
            where: {
                developer_id: devId,
            },
        });
        const createdSkills = await prismaClient.skill.createMany({
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
    } catch (e) {
        console.log(e, "ERR");
        return void res.status(511).json({
            message: "Something went wrong",
        });
    }
}
);
router.get("/getskills", devAuth, async (req, res) => {
    const devId = (req as any).developer?.id;
    try {
        const Skills = await prismaClient.developer.findMany({
            where: { id: devId },
            select: { skills: true }
        })
        return void res.status(211).json(Skills)
    } catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Couldnt get the skills"
        })
    }

});
router.get("/info", devAuth, async (req, res) => {
    try {
        return void res.status(200).json((req as any).developer);
    } catch (e) {
        console.log("ERR", e);
        return void res.status(511).json({
            message: "Could'nt get the data",
        });
    }
});

router.put("/edit/:field", devAuth, async (req, res) => {
    const field = req.params.field;
   
    const change = field==="YOE"?Number(req.body.change):req.body.change;
     
    const devId = (req as any).developer?.id;
    try {
        const data = await prismaClient.developer.update({
            where: { id: devId },
            data: {
                [field]: change,
            },
        });
        return void res.status(200).json({
            
            message: "Updated Successfully",
        });
    } catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Failed to update",
        });
    }
});


export default router;
