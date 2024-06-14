import { Request, Response, NextFunction } from "express";
import Account from "../../database/models/account";
import { verifyToken } from "../../utils/helpers";
import {Respond} from "../../utils/respond";

export default class AuthMiddleWare {
  //nhatdn
  static async isPhoneIdExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      const { phoneId } = req.body; 
      const existPhoneId = await Account.findOne({ phoneId }); 
      if (existPhoneId) {
        return respond.success(409, {
          message: "PhoneId already exists",
          data: undefined,
        });
      } 
      next();
    } catch (error) {
      return respond.error(error);
    }
  }

  static async isPhoneIdNotExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      const { phoneId } = req.body; 
      const existPhoneId = await Account.findOne({ phoneId }); 
      if (!existPhoneId) {
        return respond.success(404, {
          message: "PhoneId does not exist",
          data: undefined,
        });
      } 
      next();
    } catch (error) {
      return respond.error(error);
    }
  }
  //end nhatdn

  //check if the user already has account
  static async isEmailExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res); 
    try {
      const { email } = req.body;
      const existEmail = await Account.findOne({ email }); 
      if (existEmail) {
        return respond.success(409, {
          message: "Account already exists",
          data: undefined,
        });
      } 
      next();
    } catch (error) {
      return respond.error(error);
    }
  }

  static async isUserNotExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res); 
    try {
      const { userId } = req.body;
      const existUser = await Account.findById(userId); 
      if (existUser == null) {
        return respond.success(404, {
          message: "UserId do not exists",
          data: undefined,
        });
      } 
      next();
    } catch (error) {
      return respond.error(error);
    }
  }

  //check if the account is authorized
  static async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      if (!req.headers.authorization) {
        return respond.success(400, {
          message: "User not logged in",
          data: undefined,
        });
      }
      const { accountId } = verifyToken(
        req.headers.authorization.split(" ")[1]
      );
      if (!accountId) {
        throw new Error("Invalid auth token");
      }
      res.locals.accountId = accountId;
      next();
    } catch (error: any) {
      return respond.success(400, {
        message: "Invalid auth token",
        data: error.message,
      });
    }
  }

  //Check if the user is admin
  // static async isAdmin(req: Request, res: Response, next: NextFunction) {
  //   const respond = new Respond(res);
  //   try {
  //     const id: string = res.locals.accountId;
  //     if (!id) throw new Error("User not logged in");
  //     const exist = await Account.findById(id);
  //     if (!exist) {
  //       return respond.success(404, {
  //         message: "Account not exist",
  //         data: undefined,
  //       });
  //     }
  //     if (exist.role !== "admin") {
  //       return respond.success(401, {
  //         message: "Login as Admin to perform this action",
  //         data: undefined,
  //       });
  //     }
  //     next();
  //   } catch (error) {
  //     return respond.error(error);
  //   }
  // }
}
