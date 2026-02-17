import mongoose from "mongoose";

const ElectricityMeterSchema = new mongoose.Schema(
  {
    meterNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ElectricityMeter ||
  mongoose.model("ElectricityMeter", ElectricityMeterSchema);
