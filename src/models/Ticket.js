import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedAt: Date,
  },
  { _id: false }
);

const TicketSchema = new mongoose.Schema(
  {
    title: String,
    descriptionMarkdown: String,
    images: [String],

    status: {
      type: String,
      enum: ["OPEN", "MARKED_DOWN", "RESOLVED"],
      default: "OPEN",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    statusHistory: [StatusHistorySchema],

    // ✅ NEW
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket ||
  mongoose.model("Ticket", TicketSchema);
