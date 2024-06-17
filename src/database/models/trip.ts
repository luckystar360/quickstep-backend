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

const markerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  location: {
    type: { lat: String, lon: String },
    required: true,
  },
  name: {
    type: String,
    default: "marker",
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
const Marker = mongoose.model("Marker", markerSchema);

export { Trip, Marker };
