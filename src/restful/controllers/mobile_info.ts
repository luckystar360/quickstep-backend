import { Response, Request } from "express";
import Account from "../../database/models/account";
import { Respond } from "../../utils/respond";
import MobileInfo from "../../database/models/mobile_info";

export default class MobileInfoController {
  static getMobileInfo = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { phoneId } = req.params;
      const mobileInfo = await MobileInfo.findOne({ phoneId });
      return respond.success(200, {
        message:
          mobileInfo != null
            ? "MobileInfo retrieved successfully"
            : "MobileInfo does not exist",
        data: mobileInfo,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static updateMobileInfo = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { phoneId } = req.body;
      const existUser = await Account.findOne({ phoneId });
      if (existUser == null) throw new Error("phoneId does not exist");

      let mobileInfo = await MobileInfo.findOne({ phoneId });
      if (mobileInfo == null) {
        mobileInfo = await MobileInfo.create({ ...req.body });
      } else {
        mobileInfo.updatedAt = new Date();
        mobileInfo = {...mobileInfo.toObject(), ...req.body};
        await MobileInfo.findByIdAndUpdate(mobileInfo?.id, mobileInfo!);
      }
      const trackerIds = existUser.trackerIdList?.map((item) => item.id) ?? [];

      res.locals.io.to(trackerIds).emit("devideInfoUpdated", mobileInfo);

      return respond.success(200, {
        message: "Update device info successfully!",
        data: mobileInfo,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };
}
