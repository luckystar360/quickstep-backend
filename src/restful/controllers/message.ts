import { Response, Request } from "express";
import Account from "../../database/models/account";
import Profile from "../../database/models/profile";
import OTPService from "../../services/otp";
import { sendEmail } from "../../services/send_mail";
import { comparePwd, generateToken, hashPwd } from "../../utils/helpers";
import Respond from "../../utils/respond";
import {Message, MessageRoom} from "../../database/models/message";

export default class MessageController {
    // nhatdn
    // get messages with userId
    static getMessage = async (req: Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const { userId } = req.params;
            const messages = await Message.find({
                $or: [{ fromId: userId }, { toId: userId }],
            }).sort({ createdAt: -1 });
            return respond.success(200, {
                message: "Messages retrieved successfully",
                data: messages,
            });
        } catch (error) {
            return respond.error(error);
        }
    };

    static addMessage = async (req: Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const message = await Message.create({ ...req.body });
            return respond.success(201, {
                message: "add message successfully!",
                data: message,
            });
        } catch (error: any) {
            console.log(error);
            return respond.error(error);
        }
    };

    static createRoom = async (req: Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const message = await MessageRoom.create({ ...req.body });
            return respond.success(201, {
                message: "create room successfully!",
                data: message,
            });
        } catch (error: any) {
            console.log(error);
            return respond.error(error);
        }
    };
    //end nhatdn 
}
