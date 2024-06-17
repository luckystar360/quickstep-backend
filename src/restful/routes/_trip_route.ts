import express from "express";
import AuthValidate from "../../utils/validations/_user_validate";
import UserController from "../controllers/account";
import AuthMiddleWare from "../middlewares/_auth_middleware";
import TripController from "../controllers/trip";
import TripValidate from "../../utils/validations/_trip_validate";
import TripMiddleWare from "../middlewares/_trip_middleware";

const tripRoutes = express.Router();

// nhatdn 
tripRoutes.post(
  "/create-trip",
  AuthMiddleWare.isUserNotExist,
  TripValidate.createTrip,
  TripController.createTrip
);

tripRoutes.get(
  "/get-trip/:userId/:page?/:limit?",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  TripController.getTrips
);

tripRoutes.post(
  "/add-location",
  TripMiddleWare.isTripNotExist,
  TripValidate.addLocation,
  TripController.addLocation
);

tripRoutes.post(
  "/add-marker",
  AuthMiddleWare.isTrackerNotExist,
  TripValidate.addMarker,
  TripController.addMarker
);

tripRoutes.get(
  "/get-markers/:userId",
  // AuthMiddleWare.isLoggedIn,
  // AuthMiddleWare.isAdmin,
  TripController.getMarker
);

export default tripRoutes;