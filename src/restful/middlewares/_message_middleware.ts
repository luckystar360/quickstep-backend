import { Request, Response, NextFunction } from "express";
import Account from "../../database/models/account";
import { verifyToken } from "../../utils/helpers";
import {Respond} from "../../utils/respond";
import { MessageRoom } from "../../database/models/message";
import mongoose from "mongoose";

export default class MessageMiddleWare {
    //nhatdn
    static async isRoomExist(req: Request, res: Response, next: NextFunction) {
        const respond = new Respond(res);
        try {
            const { roomId } = req.body;
            let id;
            try {
                id = new mongoose.Types.ObjectId(roomId);
            } catch {
                return respond.success(404, {
                    message: "roomId does not exist",
                    data: undefined,
                });
            }
            const existRoomId = await MessageRoom.findById(id);
            if (existRoomId == null) {
                return respond.success(404, {
                    message: "roomId does not exist",
                    data: undefined,
                });
            }
            next();
        } catch (error) {
            return respond.error(error);
        }
    }
    //end nhatdn

}
