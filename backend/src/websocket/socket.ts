
import { WebSocketServer, WebSocket } from "ws";
import prismaClient from "../db/db";
interface User {
    socket: WebSocket;
    room: string;
}
//{ type : join,
// userId : "asdfas"
// payload : {
//  roomId : "13214"
//}
//type : chat,
//userId : "sfag"
// payload : {
// message : "faf", }
//}
//
interface SocketMap {
     [key: string]: User;
}

let allSockets: SocketMap = {};

export function InitWebsocket(){
    const wss = new WebSocketServer({port : 8080})
    wss.on("connection", (soc) => {
        console.log("user connected");
    
        soc.on("message", async (message) =>{
                    // @ts-ignore
            
            const parsedMessage = JSON.parse(message)
            const userId = parsedMessage.userId;
            const username = parsedMessage.username
            if(parsedMessage.type === "join"){
                console.log("User with Id " + userId + " joined");

                allSockets[userId] = {
                    socket: soc, 
                    room: parsedMessage.payload.roomId
                }
            }
    
            if(parsedMessage.type === "chat"){
                // console.log("")
                console.log("user with " + userId + " messaged" )
                const currRoom = allSockets[userId].room;
                const chats = await prismaClient.chat.create({
                    data : {
                        name_of_creator : username,
                        room_id : currRoom, 
                        message_created_by : userId,
                        message : parsedMessage.payload.message
                    }
                })
                Object.entries(allSockets).forEach(([key, val]) => {
                    if(currRoom === val.room && key !== userId ){
                        val.socket.send(parsedMessage.payload.message)
                    }
                })
            }
        })
        soc.on("close", () => {
          console.log("Websocket closed now")
            const userId = Object.entries(allSockets)
                .find(([_, user]) => user.socket === soc)?.[0];
            if (userId) delete allSockets[userId];
        })
    })
    
}