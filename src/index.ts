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
import MobileInfo from "./database/models/mobile_info";

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
  socket.on("joinGroup", async (data) => {
    const userId = data.userId;
    // console.log(userId);
    socket.join(userId);
    socket.emit("joinedGroup", "You're joined to the UserGroup");

    try {
      // create MobileInfo if dont exist
      const existMobileInfo = await MobileInfo.findOne({ userId: userId });
      if (existMobileInfo == null) {
        await MobileInfo.create({
          userId,
          status: "online",
          lastOnline: Date.now(),
        });
      } else {
        await MobileInfo.findByIdAndUpdate(userId, {
          status: "online",
          lastOnline: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.log("MobileInfo update error");
    }
    socket.on("disconnect", async () => {
      try {
        await MobileInfo.findByIdAndUpdate(userId, {
          status: "offline",
          updatedAt: Date.now(),
        });
      } catch (error) {
        console.log("MobileInfo update error");
      }
      console.log(`userId: ${userId} disconneted`);
    });

    // signaling
    socket.on("makeCall", (data) => {
      let calleeId = data.calleeId;
      let sdpOffer = data.sdpOffer;

      socket.to(calleeId).emit("newCall", {
        callerId: userId,
        sdpOffer: sdpOffer,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      let sdpAnswer = data.sdpAnswer;

      socket.to(callerId).emit("callAnswered", {
        callee: userId,
        sdpAnswer: sdpAnswer,
      });
    });

    socket.on("leaveCall", (data) => {
      let calleeId = data.calleeId;

      socket.to(calleeId).emit("callLeft", {
        caller: userId,
      });
    });

    socket.on("IceCandidate", (data) => {
      let calleeId = data.calleeId;
      let iceCandidate = data.iceCandidate;

      socket.to(calleeId).emit("IceCandidate", {
        sender: userId,
        iceCandidate: iceCandidate,
      });
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
