import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import Respond from "../respond";

export default class TripValidate {
    //nhatdn
    static createTrip(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object().keys({
            userId: Joi.string().required().id(),
            name: Joi.string().required().min(0).max(30),
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

    static addLocation(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object().keys({
            tripId: Joi.string().required().id(),
            lat: Joi.string().required().min(0).max(15),
            lon: Joi.string().required().min(0).max(15),
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
