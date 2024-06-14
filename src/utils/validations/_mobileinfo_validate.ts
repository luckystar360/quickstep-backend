import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import {Respond} from "../respond";

export default class MobileInfoValidate {
  //nhatdn
  static updateMobileInfo(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      phoneId: Joi.string().required().min(5).max(30),
      battery: Joi.string().min(0).max(10),
      wifi: Joi.string().min(0).max(50),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return new Respond(res).success(400, {
        message: error.details[0].message.replace(/"/g, ""),
        data: undefined,
      });
    }
    next();
  }
  //end nhatdn 
}
