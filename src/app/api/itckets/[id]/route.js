import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

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

    // 3️⃣ Get ticket ID
    const { id } = params;

    if (!id) {
      return Response.json(
        { message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // 4️⃣ Parse body
    const {
      title,
      descriptionMarkdown,
      status, // OPEN | MARKED_DOWN | RESOLVED
    } = await req.json();

    // 5️⃣ Connect DB
    await connectDB();

    // 6️⃣ Find ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // 7️⃣ Update fields (if provided)
    if (title) ticket.title = title;
    if (descriptionMarkdown) {
      ticket.descriptionMarkdown = descriptionMarkdown;
    }

    // 8️⃣ Handle status change
    if (status) {
      ticket.status = status;

      // If marked down or resolved → track who & when
      if (status === "MARKED_DOWN" || status === "RESOLVED") {
        ticket.markedDownBy = session.user.id;
        ticket.markedDownAt = new Date();
      }
    }

    // 9️⃣ Save changes
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
