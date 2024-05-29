import mongoose from "mongoose";
import OTPService from "../../services/otp";
import { customAlphabet } from "nanoid";

const accountSchema = new mongoose.Schema({
  pairId: {
    type: String,
    default: () => customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5)(),
    unique: true,
  },
  fullName: { type: String },
  phoneId: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  verified: { type: Boolean, required: true, default: false },
  role: {
    type: String,
    required: true,
    enum: ["guest", "member"],
    default: "guest",
  },
  type: {
    type: String,
    required: true,
    enum: ["tracker", "trackee"],
    default: "tracker",
  },
  trackerIdList: {
    type: [
      { id: String, nickName: String, connectedTime: Date }
    ],
    default: undefined,
  },
  trackeeIdList: {
    type: [{ id: String, nickName: String, connectedTime: Date }],
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Account = mongoose.model("Account", accountSchema);
const changeStream = Account.watch();

changeStream.on("change", async (change) => {
  if (change.operationType === "insert") {
    //Creata an OTP document in database
    await OTPService.generateOTP(change.fullDocument.email);
  }
});

export default Account;
