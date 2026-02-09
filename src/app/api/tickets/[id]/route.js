import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";

/* =====================================================
   GET /api/tickets/:id
===================================================== */
export async function GET(req, context) {
  try {
    // ✅ MUST unwrap params like this
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    await connectDB();

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "name email role")
      .populate("markedDownBy", "name email role");

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Visitor
    if (!session) {
      return Response.json(
        {
          _id: ticket._id,
          title: ticket.title,
          descriptionMarkdown: ticket.descriptionMarkdown,
          images: ticket.images,
          status: ticket.status,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        },
        { status: 200 }
      );
    }

    return Response.json(ticket, { status: 200 });
  } catch (error) {
    console.error("GET /api/tickets/[id] error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   PATCH /api/tickets/:id
===================================================== */
export async function PATCH(req, context) {
  try {
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

    // ✅ unwrap params
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    const { title, descriptionMarkdown, status } =
      await req.json();

    await connectDB();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    if (title) ticket.title = title;
    if (descriptionMarkdown)
      ticket.descriptionMarkdown = descriptionMarkdown;

    if (status) {
      ticket.status = status;

      if (status === "MARKED_DOWN" || status === "RESOLVED") {
        ticket.markedDownBy = session.user.id;
        ticket.markedDownAt = new Date();
      }
    }

    await ticket.save();

    return Response.json(
      { message: "Ticket updated", ticket },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/tickets/[id] error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
