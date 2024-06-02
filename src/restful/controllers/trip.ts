import { Response, Request } from "express";
import Trip from "../../database/models/trip";
import Respond from "../../utils/respond";

export default class TripController {
    static createTrip = async (req: Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const trip = await Trip.create({ ...req.body, createdAt: Date.now(), updatedAt: Date.now() });
            return respond.success(201, {
                message: "Trip created successfully!",
                data: trip,
            });
        } catch (error: any) {
            console.log(error);
            return respond.error(error);
        }
    }

    static getTrips = async (req: Request, res: Response) => {
        const respond = new Respond(res);
        try {
            const { tripIds } = req.params;
            var array = tripIds.split(",");
            const trips = await Trip.find({ _id: { $in: array } });
            return respond.success(200, {
                message: "Trips retrieved successfully",
                count: trips.length,
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
            const newLocation = { "lat": lat, "lon": lon };
            trip.locations = [...trip.locations, newLocation];
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