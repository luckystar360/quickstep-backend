import express from "express";
import accountRoutes from "./_account_route";
import movementRoutes from "./_movement_route";
import messageRoutes from "./_message_route";
import notificationRoutes from "./_notification_route";
import profileRoutes from "./_profile_route";
import swaggerUi from "swagger-ui-express";
import config from "../../docs";
import tripRoutes from "./_trip_route";
import deviceInfoRoutes from "./_mobileinfo_route";

const routes = express.Router();

routes.use("/messages", messageRoutes);
routes.use("/trips", tripRoutes);
routes.use("/movements", movementRoutes);
routes.use("/accounts", accountRoutes);
routes.use("/devices", deviceInfoRoutes);
routes.use("/notifications", notificationRoutes);
routes.use("/profile", profileRoutes);
routes.use("/docs", swaggerUi.serve, swaggerUi.setup(config));

export default routes;
