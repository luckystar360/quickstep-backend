import mongoose from "mongoose";
import OTPService from "../../services/otp";
import { customAlphabet } from "nanoid";

const tripSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String },
    locations: {
        type: [{ lat: String, lon: String }],
        default: [],
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

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
