import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { Respond } from "../respond";

export default class NotificationValidate {
  static sendSOS(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
      toUserIds: Joi.array().required().id(),
      fromId: Joi.string().required().id(),
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
