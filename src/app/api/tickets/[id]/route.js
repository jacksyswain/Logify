import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

/* ================================
   GET /api/tickets/:id
================================ */
export async function GET(req, context) {
  try {
    const { id } = await context.params; // ✅ Next 16 fix

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "name email role")
      .populate("markedDownBy", "name email role")
      .populate("statusHistory.changedBy", "name email");

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(ticket);
  } catch (error) {
    console.error("GET ticket error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* ================================
   PATCH /api/tickets/:id
================================ */
export async function PATCH(req, context) {
  try {
    const { id } = await context.params; // ✅ FIXED
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN"
    ) {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { descriptionMarkdown, status } = body;

    await connectDB();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Update description
    if (descriptionMarkdown !== undefined) {
      ticket.descriptionMarkdown = descriptionMarkdown;
    }

    // Update status + push history
    if (status && status !== ticket.status) {
      ticket.status = status;

      ticket.statusHistory.push({
        status,
        changedBy: session.user.id,
        changedAt: new Date(),
      });
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate("createdBy", "name email role")
      .populate("markedDownBy", "name email role")
      .populate("statusHistory.changedBy", "name email");

    return Response.json(
      { message: "Ticket updated", ticket: updatedTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH ticket error:", error);
    return Response.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================================
   DELETE /api/tickets/:id
   ADMIN only
================================ */
export async function DELETE(req, context) {
  try {
    const { id } = await context.params; // ✅ FIXED HERE

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    await Ticket.findByIdAndDelete(id);

    return Response.json(
      { message: "Ticket deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ticket error:", error);
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}