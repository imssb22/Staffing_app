import  prismaClient  from "./db/db.js"
import express from "express"
export const app = express()
import cors from "cors" 
import { InitWebsocket } from "./websocket/socket"
import mainrouter from "./routes"


    InitWebsocket();
  
app.use(cors(
    {
        origin: [
            'http://localhost:3001',
            'https://staffing-app-ochre.vercel.app'
        ],
        credentials: true,}
))
app.use(express.json())
app.use("/api/v1", mainrouter)
app.listen(3000, ()=>{ 
    console.log("Listening on port 3000")
    console.log("WebSocket Server listening on port 8080");
})