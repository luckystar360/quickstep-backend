import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import {Respond} from "../respond";

export default class MessageValidate {
  //nhatdn
  static addMessage(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object().keys({
        message: Joi.string().required().min(0).max(1000),
        fromId: Joi.string().required().id(),
        roomId: Joi.string().required().id(),
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
