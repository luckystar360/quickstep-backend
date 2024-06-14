import express from "express";
import MobileInfoController from "../controllers/mobile_info";

const deviceInfoRoutes = express.Router();

deviceInfoRoutes.get(
  "/get-deviceinfo/:phoneId",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  MobileInfoController.getMobileInfo
);

export default deviceInfoRoutes;
