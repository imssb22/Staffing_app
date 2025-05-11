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
exports.InitWebsocket = InitWebsocket;
const ws_1 = require("ws");
const db_1 = __importDefault(require("../db/db"));
let allSockets = {};
function InitWebsocket() {
    const wss = new ws_1.WebSocketServer({ port: 8080 });
    wss.on("connection", (soc) => {
        console.log("user connected");
        soc.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const parsedMessage = JSON.parse(message);
            const userId = parsedMessage.userId;
            const username = parsedMessage.username;
            if (parsedMessage.type === "join") {
                console.log("User with Id " + userId + " joined");
                allSockets[userId] = {
                    socket: soc,
                    room: parsedMessage.payload.roomId
                };
            }
            if (parsedMessage.type === "chat") {
                console.log("user with " + userId + " messaged");
                const currRoom = allSockets[userId].room;
                yield db_1.default.chat.create({
                    data: {
                        name_of_creator: username,
                        room_id: currRoom,
                        message_created_by: userId,
                        message: parsedMessage.payload.message
                    }
                });
                // Create a proper message object
                const messageToSend = {
                    type: "chat",
                    name_of_creator: username,
                    message: parsedMessage.payload.message,
                    room_id: currRoom,
                    createdAt: new Date()
                };
                Object.entries(allSockets).forEach(([key, val]) => {
                    if (currRoom === val.room && key !== userId) {
                        val.socket.send(JSON.stringify(messageToSend)); // Send stringified JSON object
                    }
                });
            }
        }));
        soc.on("close", () => {
            var _a;
            console.log("Websocket closed now");
            const userId = (_a = Object.entries(allSockets)
                .find(([_, user]) => user.socket === soc)) === null || _a === void 0 ? void 0 : _a[0];
            if (userId)
                delete allSockets[userId];
        });
    });
}
