import express from "express";
import MessageController from "../controllers/message";
import MessageValidate from "../../utils/validations/_message_validate";
import MessageMiddleWare from "../middlewares/_message_middleware";

const messageRoutes = express.Router();

// nhatdn
messageRoutes.get(
    "/get-message/:userId",
    // AuthMiddleWare.isLoggedIn,
    // AuthMiddleWare.isAdmin,
    MessageController.getMessage
);

messageRoutes.post(
    "/add-message",
    MessageMiddleWare.isRoomExist,
    MessageValidate.addMessage,
    MessageController.addMessage
);

messageRoutes.post(
    "/create-room",
    // MessageValidate.addMessage,
    MessageController.createRoom
);
//nhatdn end


export default messageRoutes;
