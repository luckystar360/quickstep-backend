import { Response, Request } from "express";
import Account from "../../database/models/account";
import Profile from "../../database/models/profile";
import OTPService from "../../services/otp";
import { sendEmail } from "../../services/send_mail";
import { comparePwd, generateToken, hashPwd } from "../../utils/helpers";
import Respond from "../../utils/respond";
import { MessageRoom } from "../../database/models/message";

export default class UserController {
  // nhatdn
  // get user with phoneId
  static getUser = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { phoneId } = req.params;
      const user = await Account.findOne({
        phoneId: phoneId,
      });
      return respond.success(200, {
        message:
          user != null ? "User retrieved successfully" : "User does not exist",
        data: user,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static createUser = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const account = await Account.create({ ...req.body });
      return respond.success(201, {
        message: "Account created successfully!",
        data: account,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };

  static getUsers = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { ids } = req.params;
      var array = ids.split(",");
      const users = await Account.find({ _id: { $in: array } });
      return respond.success(200, {
        message: "Users retrieved successfully",
        count: users.length,
        data: users,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static connectToTracker = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { trackeeId, trackerCode } = req.body;

      const trackee = await Account.findOne({
        _id: trackeeId,
        type: "trackee",
      });
      const tracker = await Account.findOne({
        pairId: trackerCode,
        type: "tracker",
      });
      if (trackee == null)
        return respond.success(404, {
          message: "Trackee does not exist",
          data: trackeeId,
        });
      if (tracker == null)
        return respond.success(404, {
          message: "The Code does not exist",
          data: trackerCode,
        });

      if (trackee.trackerIdList?.find((item) => item.id == tracker.id) == null)
        trackee.trackerIdList = [
          ...(trackee.trackerIdList ?? []),
          {
            id: tracker.id,
            nickName: "tracker",
            connectedTime: new Date(),
          },
        ];
      else
        return respond.success(409, {
          message: "The tracker already exists",
          data: tracker,
        });

      tracker.trackeeIdList = [
        ...(tracker.trackeeIdList ?? []),
        {
          id: trackee.id,
          nickName: "trackee",
          connectedTime: new Date(),
        },
      ];

      await Account.findByIdAndUpdate(trackee.id, trackee);
      await Account.findByIdAndUpdate(tracker.id, tracker);

      res.locals.io?.to(trackerCode).emit("newEvent", trackee);

      // kiem tra xem da ton tai roomChat chua
      const existRooms = await MessageRoom.find({
        usersId: { $in: [trackeeId] },
      });
      if (existRooms.length === 0) {
        console.log("create new room");
        //neu chua ton tai roomChat cua trackee thi tao moi
        await MessageRoom.create({
          name: `group_${trackeeId}`,
          usersId: [trackeeId, tracker.id],
        });
      } else if (existRooms.length > 0) {
        console.log("already exist room");
        for (const room of existRooms) {
          room.usersId = [...room.usersId, tracker.id];
          await MessageRoom.findByIdAndUpdate(room.id, room);
        }
      }
      return respond.success(200, {
        message: "Users have been paired",
        data: trackee,
      });
    } catch (error) {
      return respond.error(error);
    }
  };
  //end nhatdn

  // Getting all users
  static getAllUsers = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const users = await Profile.find({
        userId: { $ne: res.locals.accountId },
      });
      return respond.success(200, {
        message: "Users retrieved successfully",
        count: users.length,
        data: users,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  //Creaeting new account
  static createAccount = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const password = await hashPwd(req.body.password);
      const account = await Account.create({
        ...req.body,
        password,
        role: "member",
      });
      return respond.success(201, {
        message: "Account created successfully, verify email",
        data: account,
      });
    } catch (error: any) {
      return respond.error(error);
    }
  };

  static verifyEmail = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { email, otp } = req.body;
      const result = await OTPService.getOTP({ email, otp });

      if (!result) throw new Error("OTP not found");

      const data = await Account.findOneAndUpdate(
        { email: result.email, verified: false },
        { verified: true },
        { new: true }
      );

      if (!data) throw new Error("Account not found");

      return respond.success(200, {
        message: "Account verified successfully, create profile",
        data,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static resendOTP = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { email } = req.body;
      const result = await OTPService.checkUserOTP(email);

      if (!result) {
        await OTPService.generateOTP(email);
        return respond.success(200, {
          message: "OTP sent successfully",
          data: undefined,
        });
      }
      sendEmail(result.email, result.otp);

      return respond.success(200, {
        message: "OTP resent successfully",
        data: undefined,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static login = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { email, password } = req.body;

      const user = await Account.findOne({ email });

      if (!user) {
        return respond.success(404, {
          message: "Account does not exist in our system",
          data: email,
        });
      }

      const validPwd = await comparePwd(password, user.password!);
      if (!validPwd) {
        return respond.success(401, {
          message: "Invalid password",
          data: email,
        });
      }
      const token = generateToken(user.id);

      return respond.success(200, {
        message: "User logged in successfully",
        data: { user, token },
      });
    } catch (error) {
      return respond.error(error);
    }
  };
}
