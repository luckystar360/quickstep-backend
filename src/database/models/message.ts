import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    fromId: { type: String, required: true },
    roomId: { type: String, required: true},
    createdAt: 'created_at',
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const roomSchema = new mongoose.Schema({
    name: { type: String},
    usersId: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Message = mongoose.model("Message", messageSchema);
const MessageRoom = mongoose.model("MessageRoom", roomSchema);

export { Message, MessageRoom };
