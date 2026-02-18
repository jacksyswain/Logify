import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

/* ================================
   GET /api/tickets/:id
================================ */
export async function GET(req, context) {
  try {
    const params = await context.params; // ✅ IMPORTANT
    const { id } = params;

    await connectDB();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(ticket);

  } catch (error) {
    console.error(error);
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
    const { id } = context.params;
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

    /* Update description */
    if (descriptionMarkdown) {
      ticket.descriptionMarkdown = descriptionMarkdown;
    }

    /* Update status + history */
    if (status && status !== ticket.status) {
      ticket.status = status;

      ticket.statusHistory.push({
        status,
        changedBy: session.user.id,
        changedAt: new Date(),
      });
    }

    await ticket.save();

    return Response.json(
      { message: "Ticket updated", ticket },
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
