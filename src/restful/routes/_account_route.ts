import express from "express";
import AuthValidate from "../../utils/validations/_user_validate";
import UserController from "../controllers/account";
import AuthMiddleWare from "../middlewares/_auth_middleware";

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
  AuthMiddleWare.isAccountExist,
  UserController.createAccount
);

accountRoutes.post("/login", AuthValidate.login, UserController.login);

accountRoutes.post(
  "/verify-account",
  AuthValidate.otp,
  UserController.verifyEmail
);

accountRoutes.post("/resend-otp", AuthValidate.email, UserController.resendOTP);

export default accountRoutes;
