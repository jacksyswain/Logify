import mongoose from "mongoose";

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["OPEN", "MARKED_DOWN", "RESOLVED"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    descriptionMarkdown: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["OPEN", "MARKED_DOWN", "RESOLVED"],
      default: "OPEN",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket ||
  mongoose.model("Ticket", TicketSchema);
