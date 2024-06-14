import mongoose from "mongoose";

const MobileInfoSchema = new mongoose.Schema({
  phoneId: { type: String, required: true },
  wifi: { type: String },
  battery: { type: Number },
  lastOnline: {
    type: Date,
    default: () => Date.now(),
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const MobileInfo = mongoose.model("MobileInfo", MobileInfoSchema);

export default MobileInfo;
