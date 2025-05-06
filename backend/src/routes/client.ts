import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import { userAuth } from "../middleware/Auth";
import { User } from "../interfaces";
import { Developer } from "../interfaces";
const cookieParser = require('cookie-parser');
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openaiClient = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });
interface UserRequest extends Request {
  user?: User;
}

import prismaClient from "../db/db";

const router = express.Router();
const SKILL_SCHEMA = zod.object({
  name: zod.string(),
  proficiency: zod.string()
})
const PROJECT = zod.object({
  name: zod.string(),
  roomid: zod.string().optional(),
  budget: zod.number().multipleOf(0.1),
  timeline: zod.number(),
  required_developers: zod.number(),
  skills : zod.array(SKILL_SCHEMA),
  Assigned_developers: zod.array(zod.object({
  id:             zod.string(),   
  name:           zod.string(),
  YOE:            zod.number().multipleOf(0.1),
  email:          zod.string().email(),
  phone:          zod.string(),
  password:       zod.string(),
  rating:         zod.number().multipleOf(0.1),
  hrate:          zod.number()
  }))

});
const USER_BODY = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  company: zod.string(),
  password: zod.string(),
  phone: zod.string(),
  rating: zod.number().multipleOf(0.01).optional(),
});
const SIGNINBODY = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
router.post("/signup", async (req: Request, res: Response) => {
  const parsedUser = USER_BODY.safeParse(req.body);

  if (!parsedUser.success) {
    return void res.status(400).json({ error: "Invalid user data" });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        name: parsedUser.data.name,
        email: parsedUser.data.email,
        company: parsedUser.data.company,
        password: parsedUser.data.password,
        phone: parsedUser.data.phone,
        rating: parsedUser.data.rating,
      },
    });
const role = "client"
    const token = jwt.sign(
      {
        userId: user.id,
      },
      //@ts-ignore
      process.env.USER_JWT_SECRET
    );
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
      userId : user.id,
      username : user.name
    });
  } catch (error) {
    return void res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/info", userAuth, async(req, res) =>{
    try{
       return void res.status(202).json((req as any).user);
    }catch(e){
      console.log(e);
      return void res.status(504).json({
        message : "Cant fetch info"
      })
    }
})
router.post("/signin", async (req: Request, res: Response) => {
  const parsedSignin = SIGNINBODY.safeParse(req.body);
  if (!parsedSignin.success) {
    return void res.status(400).json({
      error: "Inputs format not correct should be handled in frontend itself",
    });
  }
  const user = await prismaClient.user.findFirst({
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
    const role = "client"

        
    const token = jwt.sign(
      {
        userId: user.id,
      },
      //@ts-ignore
      process.env.USER_JWT_SECRET
    );
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
      userId : user.id,
      username : user.name
    });
  }
  
  return void res.status(400).json({
    error: "Please check your email or password",
  });
});
router.post("/addproject",userAuth ,async (req: UserRequest, res: Response) => {
  debugger
  
  console.log(req.body)

    const parsedProject = PROJECT.safeParse(req.body);
    if (!parsedProject.success) {
      return void res.status(400).json({
        message: "Invalid inputs",
      });
    }
    const created_by = req.user?.id;
    try {
      if (created_by) {
        const room = await prismaClient.room.create({
          data: {
            admin: created_by,
          },
        });
        if (room) {
          const project = await prismaClient.project.create({
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

          const skills = req.body.skills as {
            name:        string;
            proficiency: string;
          }[]
        
          const projectId =  project.id
             try {
              if(!Array.isArray(skills)){
                return void res.status(400).json({
                  message: "The input skills must be an array"
                })
              }
              let valid  = true
              skills.forEach((skill)=>{
                if (!skill.name || !skill.proficiency) {
                  valid = false
              }
              })
              if(!valid){
                 return void res.status(400).json({
                  message: "Some Skill is empty"
                 })
              }
              const projectskills = await prismaClient.projectSkill.createMany({
                data: skills.map((skill) => ({
                  project_id: projectId,
                  name: skill.name,
                  proficiency: skill.proficiency,
              })),
              })
              return void res.status(200).json({
                message: project,
                room: room,
                skills: projectskills
              });
            } catch (error) {
              console.log(error, "ERR");
              return void res.status(511).json({
                  message: "Something went wrong",
              });
             }          
        } else {
          return void res.status(400).json({
            message: "Room not created hence project not created",
          });
        }
      } else {
        return void res.status(400).json({
          message: "Relogin as created by not available",
        });
      }
    } catch (error) {
      console.log(error);
      return void res.status(400).json({
        error: error,
      });
    }
  }
);
router.put("/edit/:field", userAuth, async (req, res) => {
    
  const field = req.params.field;
  const change = req.body.change;
  const userId = (req as any).user?.id;
  try {
      const data = await prismaClient.user.update({
          where: { id: userId },
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

router.get("/myprojects", userAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const username = (req as any).user?.name;
  try {
      const projects = await prismaClient.user.findMany({
          where: { id: userId },
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
router.post("/llm", async(req, res) => {
  debugger
  const input = req.body.input;
  try{
      const devs = await prismaClient.developer.findMany({
          select : {
              id : true,
              name : true, 
              YOE : true,
              // rating : true,
              // schedule : true,
              // hourly_rate : true,
              skills : true
          }
      })
      console.log(devs)
      const prompt = `
      context : ${input}
      
      Deduce the budget, duration, and the kind of project the user wants to build from the context
      provided. Below is the list of available developers. Scan through them and retrieve the relevant 
      information. If the context contains the tech stack to be used explicitly then only select those
      developers with the given data. If the context contains minimum proficiency and/or minimum rating 
      then also put the relevant filter while selecting the developers
      
      Here is the list of the developers to choose from:
      Available developer : ${devs.map((d) => 
          ` -> (Id : ${d.id}): Skills: ${d.skills.map(skill => 
          `${skill.name} + ${skill.proficiency}`).join(", ")}, Name: ${d.name}, YOE: ${d.YOE}`
      ).join("\n")}
      
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

      `

      const response = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: "user", content: prompt }]
        });
      
      const outputText = response.choices[0].message.content;

      // Try to extract JSON from the LLM output
      let retrievedList = {};
      let timeline:number = 1
      let budget:number = 1000
      let skills = {}
      let name = "goodname"

      try {
        if (!outputText) {
          throw new Error("Output text is null or undefined");
        }
        const jsonStart = outputText.indexOf('{');
        const jsonEnd = outputText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = outputText.substring(jsonStart, jsonEnd + 1);
          timeline      = JSON.parse(jsonString).timeline;
          budget        = JSON.parse(jsonString).budget;
          skills        = JSON.parse(jsonString).skills;
          name          = JSON.parse(jsonString).name;
          retrievedList = JSON.parse(jsonString).retrievedList;

        }
      } catch (e) {
        console.log("Failed to parse retrievedList from LLM output");
      }

      console.log(prompt, "\n \n");
      console.log(outputText, "\n \n");
      console.log( retrievedList)
      console.log("budget " + budget )
      console.log("timeline " + timeline)
      console.log("Skills: " + skills)
      console.log("name: " + name)
      
      return void res.status(200).json({ timeline, budget, retrievedList, name, skills })
      
  }
  catch(e){
      console.log(e);
      return void res.status(511).json({
          message: "Something went wrong"
      })
  }
})
router.post("/getdevs", userAuth, async(req, res)=>{
 
    const ids = req.body.ids;
    const developers = await prismaClient.developer.findMany({
      where: {
        id: {
          in: ids // Use the 'in' operator for array of IDs
        }
      }
    });
  debugger
  console.log(developers);
  return void res.status(200).json(
    developers
  )
  } catch (error) {
    console.log(error);
      return void res.status(511).json({
          message: "Something went wrong"
      })
  }
})

export default router;
