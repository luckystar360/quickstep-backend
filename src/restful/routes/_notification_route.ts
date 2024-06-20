import express from "express";
import {
  deleteNotification,
  getNotifications,
  sendSOS,
} from "../controllers/notification";
import AuthMiddleWare from "../middlewares/_auth_middleware";
import NotificationValidate from "../../utils/validations/_notification_validate";

const notificationRoutes = express.Router();

notificationRoutes.post("/send-sos", NotificationValidate.sendSOS, sendSOS);

notificationRoutes.get("/", AuthMiddleWare.isLoggedIn, getNotifications);
notificationRoutes.delete(
  "/:id",
  AuthMiddleWare.isLoggedIn,
  deleteNotification
);

export default notificationRoutes;
