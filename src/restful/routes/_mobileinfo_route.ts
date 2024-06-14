import express from "express";
import MobileInfoController from "../controllers/mobile_info";
import MobileInfoValidate from "../../utils/validations/_mobileinfo_validate";
import AuthMiddleWare from "../middlewares/_auth_middleware";

const deviceInfoRoutes = express.Router();

deviceInfoRoutes.get(
  "/get-deviceinfo/:phoneId",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  MobileInfoController.getMobileInfo
);

deviceInfoRoutes.post(
  "/update-deviceinfo", 
  AuthMiddleWare.isPhoneIdNotExist,
  MobileInfoValidate.updateMobileInfo,
  MobileInfoController.updateMobileInfo
);
export default deviceInfoRoutes;
