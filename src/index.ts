import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import * as dotenv from "dotenv";
import routes from "./restful/routes";
import {
  getCurrentUser,
  getRoomUsers,
  userJoin,
  userLeave,
} from "./utils/users";
import User from "./@types/user";
import { connectDB } from "./database/config";
import { Message, MessageRoom } from "./database/models/message";
import Account from "./database/models/account";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Running when user connects
io.on("connection", (socket: Socket) => {
  console.log("connection");
  socket.on("joinGroup", (data) => {
    const userId = data.userId;
    // console.log(userId);
    socket.join(userId);
    socket.emit("joinedGroup", "You're joined to the UserGroup");
    socket.on("disconnect", () => {
      console.log(`userId: ${userId} disconneted`);
    });
  });

  socket.on("useTrip", (data) => {
    const tripId = data.tripId;
    // console.log(tripId);
    socket.join(tripId);
    socket.emit("tripConnected", "You're connected to the Trip");

    socket.on("disconnect", () => {
      console.log(`tripId: ${tripId} disconneted`);
    });
  });

  socket.on("waitToPair", async (data) => {
    const { trackerCode } = data;
    try {
      socket.join(trackerCode);
    } catch (error: any) {
      console.log(error);
    }
  });

  // for webrtc
  socket.on("createPeer", async (data) => {
    try {
      const { fromId, destId, peerId } = data;
      socket.to(destId).emit("peerCreating", {fromId, peerId});
    } catch (error: any) {
      console.log(error);
    }
  });

  socket.on("acceptPeer", async (data) => {
    try {
      const { fromId, destId, peerId } = data;
      socket.to(destId).emit("peerAccepted", {fromId, peerId});
    } catch (error: any) {
      console.log(error);
    }
  });

  socket.on("destroyPeer", async (data) => {
    try {
      const { fromId, destId, peerId } = data;
      socket.to(destId).emit("peerDestroyed", {fromId, peerId});
    } catch (error: any) {
      console.log(error);
    }
  });

  //Send users and room info
  // io.to(user.room).emit("roomUsers", {
  //   room: user.room,
  //   users: getRoomUsers(user.room),
  // });

  // });
});

// Default home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Quick step App backend!",
  });
});

// Restful API routes
app.use("/api/v1/", (req, res, next) => {
  res.locals.io = io;
  next();
});
app.use("/api/v1/", routes);

app.get("*", (req, res) => {
  res.json({
    message: "Invalid path URL!",
  });
});

// Listening on the PORT server
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} 🔥`);
  await connectDB();
});
