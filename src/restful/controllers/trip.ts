import { Response, Request } from "express";
import Trip from "../../database/models/trip";
import {PaginationRespond, Respond} from "../../utils/respond";

export default class TripController {
  static createTrip = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { userId } = req.body;
      const trip = await Trip.create({
        ...req.body,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      res.locals.io?.to(userId).emit("newTrip", trip);
      return respond.success(201, {
        message: "Trip created successfully!",
        data: trip,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };

  static getTrips = async (req: Request, res: Response) => {
    const respond = new PaginationRespond(res);
    try {
      const { userId, page=0, limit=5 } = req.params;
      const pageNumber = Number(page) ;
      const limitNumber = Number(limit);
      const offset = pageNumber * limitNumber;
      const total = await Trip.count();
      const trips = await Trip.find({ userId: userId }).sort({
        createdAt: -1,
      }).skip(offset).limit(limitNumber);
      const prevPage = page > 0 ? (pageNumber -1) : undefined;
      const nextPage = page < (total / limitNumber) ? pageNumber + 1 : undefined;
      return respond.success(200, {
        message: "Trips retrieved successfully",
        total: total,
        prevPage: prevPage,
        nextPage: nextPage,
        data: trips,
      });
    } catch (error) {
      return respond.error(error);
    }
  };

  static addLocation = async (req: Request, res: Response) => {
    const respond = new Respond(res);
    try {
      const { tripId, lat, lon } = req.body;
      const trip = await Trip.findById(tripId);
      if (!trip) throw new Error("Trip not found");
      const newLocation = { lat: lat, lon: lon };
      trip.locations = [...trip.locations, newLocation];
      trip.updatedAt = new Date();
      await Trip.findByIdAndUpdate(tripId, trip);
      res.locals.io?.to(tripId).emit("newLocation", newLocation);
      return respond.success(201, {
        message: "add location successfully!",
        data: trip,
      });
    } catch (error: any) {
      console.log(error);
      return respond.error(error);
    }
  };
}
