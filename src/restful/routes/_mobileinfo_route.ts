import express from "express";
import MobileInfoController from "../controllers/mobile_info";
import MobileInfoValidate from "../../utils/validations/_mobileinfo_validate";

const deviceInfoRoutes = express.Router();

deviceInfoRoutes.get(
  "/get-deviceinfo/:phoneId",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  MobileInfoController.getMobileInfo
);

deviceInfoRoutes.post(
  "/update-deviceinfo", 
  MobileInfoValidate.updateMobileInfo,
  MobileInfoController.updateMobileInfo
);
export default deviceInfoRoutes;
