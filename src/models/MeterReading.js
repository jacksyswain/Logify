import mongoose from "mongoose";

const MeterReadingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["GAS", "WATER"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    readingDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

export default mongoose.models.MeterReading ||
  mongoose.model("MeterReading", MeterReadingSchema);
