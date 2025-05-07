"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./websocket/socket");
const routes_1 = __importDefault(require("./routes"));
if (process.env.NODE_ENV !== 'test') {
    (0, socket_1.InitWebsocket)();
}
exports.app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3001',
        'https://staffing-app-ochre.vercel.app'
    ],
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use("/api/v1", routes_1.default);
exports.app.listen(3000, () => {
    console.log("Listening on port 3000");
    console.log("WebSocket Server listening on port 8080");
});
