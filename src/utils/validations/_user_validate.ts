import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import {Respond} from "../respond";

export default class AuthValidate {
  //nhatdn
  static createUser(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      phoneId: Joi.string().required().min(5).max(30),
      type: Joi.string().required().valid("tracker", "trackee"),
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

  static create(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      fullName: Joi.string().min(0).max(40), 
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6).max(12),
      role: Joi.string().valid("guest", "member"),
      type: Joi.string().valid("tracker", "trackee"),
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

  static otp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      otp: Joi.number().integer().max(9999).required(),
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

  static email(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
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

  static login(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6).max(12),
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
}
