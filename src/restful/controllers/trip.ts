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
            trip.locations = [...trip.locations, {"lat":lat,"lon":lon}];
            await Trip.findByIdAndUpdate(tripId, trip);
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