import express from "express";
import {
  deleteNotification,
  getNotifications,
  sendSOS,
} from "../controllers/notification";
import AuthMiddleWare from "../middlewares/_auth_middleware";

const notificationRoutes = express.Router();

notificationRoutes.post("/sendSOS", sendSOS);

notificationRoutes.get("/", AuthMiddleWare.isLoggedIn, getNotifications);
notificationRoutes.delete(
  "/:id",
  AuthMiddleWare.isLoggedIn,
  deleteNotification
);

export default notificationRoutes;
