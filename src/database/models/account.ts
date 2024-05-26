import mongoose from "mongoose";
import OTPService from "../../services/otp";

const accountSchema = new mongoose.Schema({
  fullName: { type: String},
  phoneId: { type: String, unique: true },
  email: { type: String},
  password: { type: String},
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
  trackerIdList:{
    type: [String], default: undefined 
  },
  trackeeIdList:{
    type: [String], default: undefined 
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
