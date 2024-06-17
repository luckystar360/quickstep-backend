import { Request, Response, NextFunction } from "express";
import { Respond } from "../../utils/respond";
import { Marker, Trip } from "../../database/models/trip";

export default class TripMiddleWare {
  //nhatdn
  static async isTripNotExist(req: Request, res: Response, next: NextFunction) {
    const respond = new Respond(res);
    try {
      const { tripId } = req.body;
      const existTrip = await Trip.findById(tripId);
      if (existTrip == null) {
        return respond.success(404, {
          message: "TripId do not exists",
          data: undefined,
        });
      }
      next();
    } catch (error) {
      return respond.error(error);
    }
  }

  static async isMarkerNotExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const respond = new Respond(res);
    try {
      const { markerId } = req.body;
      const existMarker = await Marker.findById(markerId);
      if (existMarker == null) {
        return respond.success(404, {
          message: "markerId do not exists",
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
