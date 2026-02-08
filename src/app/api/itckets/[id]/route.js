import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

/* =====================================================
   GET /api/tickets/:id
   Fetch single ticket (public + role-aware)
===================================================== */
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Optional session (visitors allowed)
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

    // Visitor → limited data
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

    // Logged-in users → full data
    return Response.json(ticket, { status: 200 });
  } catch (error) {
    console.error("Get Single Ticket Error:", error);
    return Response.json(
      { message: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

/* =====================================================
   PATCH /api/tickets/:id
   Update / Mark Down / Resolve ticket
===================================================== */
export async function PATCH(req, { params }) {
  try {
    // 1️⃣ Get session
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Role check
    const role = session.user.role;
    if (role !== "ADMIN" && role !== "TECHNICIAN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 3️⃣ Ticket ID
    const { id } = params;

    if (!id) {
      return Response.json(
        { message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // 4️⃣ Parse body
    const { title, descriptionMarkdown, status } = await req.json();

    await connectDB();

    // 5️⃣ Find ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Update fields
    if (title) ticket.title = title;
    if (descriptionMarkdown) {
      ticket.descriptionMarkdown = descriptionMarkdown;
    }

    // 7️⃣ Status update
    if (status) {
      ticket.status = status;

      if (status === "MARKED_DOWN" || status === "RESOLVED") {
        ticket.markedDownBy = session.user.id;
        ticket.markedDownAt = new Date();
      }
    }

    // 8️⃣ Save
    await ticket.save();

    return Response.json(
      {
        message: "Ticket updated successfully",
        ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Ticket Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
