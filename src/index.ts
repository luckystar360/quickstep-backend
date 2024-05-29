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
  console.log('connection');

  socket.on("useMessage", (data)=>{
    const userId = data.userId;
    console.log(userId);
    socket.join(userId);
    socket.emit("messageConnected", "You're connected to the RoomMessage");
  })

  socket.on("createRoomMessage",async (data) => {
    const userId = data.userId;
    const name = data.name;
    const usersId = data.usersId;
    const room = await MessageRoom.create({name, usersId});
    if(room.usersId.length == 2) {
      const user2Id = room.usersId.find((id)=> userId != id);
      const user2 = await Account.findById(user2Id);
      room.name = user2?.fullName ?? user2Id;
    }
    socket.broadcast.to(usersId).emit("roomMessageCreated", room);
  });

  // socket.on("joinRoomMessage", (data) => {
  //   const roomId = data.roomId;
  //   const userId = data.userId;
  //   console.log(`roomId: ${roomId} userId: ${userId}`);
  //   socket.join(roomId);

  //   //Welcome to user
  //   socket.emit("connected", "You're connected to the RoomMessage");
  //   socket.broadcast
  //     .to(roomId)
  //     .emit("connected", `${userId} has joined the room`);
 
    //Chatting message
    socket.on("addMessage", async (data) => {
      const { message, fromId, roomId } = data; 
      try {
        const room = await MessageRoom.findById(roomId);
        const mess = await Message.create({ message, fromId, roomId });
        if (mess != null) {
          io.to(room?.usersId ?? []).emit("newMessage", mess);
        }
      } catch (error: any) {
        console.log(error);
      }
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

    //Runs when clients disconnect
    // socket.on("disconnect", () => {
    //   const leavingUser = userLeave(user.id);
    //   if (!leavingUser) return;
    //   io.to(leavingUser.room).emit(
    //     "connected",
    //     `${leavingUser.username} has left the party`
    //   );
    //   //Send users and room info
    //   io.to(user.room).emit("roomUsers", {
    //     room: user.room,
    //     users: getRoomUsers(user.room),
    //   });
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
