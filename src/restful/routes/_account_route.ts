import express from "express";
import AuthValidate from "../../utils/validations/_user_validate";
import UserController from "../controllers/account";
import AuthMiddleWare from "../middlewares/_auth_middleware";
import { upload } from "../../utils/multer";
import { uploadPhoto } from "../middlewares/_upload_photo";

const accountRoutes = express.Router();

// nhatdn
accountRoutes.get(
  "/get-user/:phoneId",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  UserController.getUser
);
accountRoutes.post(
  "/create-user",
  AuthValidate.createUser,
  AuthMiddleWare.isPhoneIdExist,
  UserController.createUser
);
accountRoutes.get(
  "/get-users/:ids",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  UserController.getUsers
);
accountRoutes.post(
  "/connect-to-tracker", 
  UserController.connectToTracker
);
accountRoutes.post(
  "/edit-tracker-nickName",
  UserController.editTrackerInfo
);
accountRoutes.post(
  "/edit-trackee-nickName",
  UserController.editTrackeeInfo
);

//nhatdn end

accountRoutes.get(
  "/",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  UserController.getAllUsers
);
accountRoutes.post(
  "/create",
  AuthValidate.create,
  AuthMiddleWare.isEmailExist,
  UserController.createAccount
);
accountRoutes.post(
  "/upload-avatar",
  AuthMiddleWare.isLoggedIn,
  upload.single("img"),
  uploadPhoto,
  UserController.uploadAvatar
);

// accountRoutes.post("/login", AuthValidate.login, UserController.login);

// accountRoutes.post(
//   "/verify-account",
//   AuthValidate.otp,
//   UserController.verifyEmail
// );

// accountRoutes.post("/resend-otp", AuthValidate.email, UserController.resendOTP);

export default accountRoutes;
