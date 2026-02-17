import mongoose from "mongoose";

const ElectricityReadingSchema = new mongoose.Schema(
  {
    meterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ElectricityMeter",
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

export default mongoose.models.ElectricityReading ||
  mongoose.model("ElectricityReading", ElectricityReadingSchema);
