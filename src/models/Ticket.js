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
      trim: true,
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
      required: true,
    },

    // ✅ THIS WAS MISSING
    markedDownBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    markedDownAt: {
      type: Date,
      default: null,
    },

    // ✅ Activity timeline
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Performance indexes (important for SaaS)
TicketSchema.index({ status: 1 });
TicketSchema.index({ createdAt: -1 });

export default mongoose.models.Ticket ||
  mongoose.model("Ticket", TicketSchema);
