import { Response, Request } from "express";
import Account from "../../database/models/account";
import Profile from "../../database/models/profile";
import OTPService from "../../services/otp";
import { sendEmail } from "../../services/send_mail";
import { comparePwd, generateToken, hashPwd } from "../../utils/helpers";
import Respond from "../../utils/respond";
import { Message, MessageRoom } from "../../database/models/message";

export default class MessageController {
  // nhatdn
  // get messages with userId
  // static getMessage = async (req: Request, res: Response) => {
  //   const respond = new Respond(res);
  //   try {
  //     const { userId } = req.params;
  //     const messages = await Message.find({
  //       $or: [{ fromId: userId }],
  //     }).sort({ createdAt: -1 });
  //     return respond.success(200, {
  //       message: "Messages retrieved successfully",
  //       data: messages,
  //     });
  //   } catch (error) {
  //     return respond.error(error);
  //   }
  // };

  static getMessage = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { roomId } = req.params;
      const messages = await Message.find({
        roomId,
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
      const { roomId } = req.body;
      const room = await MessageRoom.findById(roomId);
      const message = await Message.create({ ...req.body });
      if (message != null) {
        res.locals.io.to(room?.usersId ?? []).emit("newMessage", message);
      }
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
      const { usersId } = req.body;
      const existRooms = await MessageRoom.find({
        usersId: { $in: usersId },
      });
      if (existRooms.length > 0) {
        return respond.success(409, {
          message: "Room already exists!",
          data: existRooms[0],
        });
      }
      const room = await MessageRoom.create({ ...req.body });
      res.locals.io.to(usersId).emit("roomMessageCreated", room);
      return respond.success(201, {
        message: "create room successfully!",
        data: room,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };

  static getRooms = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { userId } = req.params;
      const rooms = await MessageRoom.find({
        usersId: { $in: [userId] },
      }).sort({ updateddAt: -1 });
      // for (const room of rooms) {
      //   if (room.usersId.length == 2) {
      //     const user2Id = room.usersId.find((id) => id != userId);
      //     const user2 = await Account.findById(user2Id);
      //     room.name = user2Id;
      //   }
      // }

      return respond.success(200, {
        message: "Rooms retrieved successfully!",
        data: rooms,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };
  //end nhatdn
}
