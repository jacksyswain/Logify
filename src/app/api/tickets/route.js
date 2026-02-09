import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

/* =====================================================
   POST /api/tickets
   Create a new ticket (ADMIN / TECHNICIAN only)
===================================================== */
export async function POST(req) {
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
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN"
    ) {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 3️⃣ Parse request body
    const { title, descriptionMarkdown, images = [] } =
      await req.json();

    if (!title || !descriptionMarkdown) {
      return Response.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Connect DB
    await connectDB();

    // 5️⃣ Create ticket
    const ticket = await Ticket.create({
      title,
      descriptionMarkdown,
      images,
      status: "OPEN",
      createdBy: session.user.id,
    });

    return Response.json(
      {
        message: "Ticket created successfully",
        ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tickets error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   GET /api/tickets
   Public + authenticated ticket listing
===================================================== */
export async function GET() {
  try {
    // 1️⃣ Optional session (visitors allowed)
    const session = await getServerSession(authOptions);

    // 2️⃣ Connect DB
    await connectDB();

    // 3️⃣ Fetch tickets
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role")
      .populate("markedDownBy", "name email role");

    // 4️⃣ Public (visitor) response
    if (!session) {
      const publicTickets = tickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.title,
        descriptionMarkdown: ticket.descriptionMarkdown,
        images: ticket.images,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      }));

      return Response.json(publicTickets, {
        status: 200,
      });
    }

    // 5️⃣ Logged-in users get full data
    return Response.json(tickets, { status: 200 });
  } catch (error) {
    console.error("GET /api/tickets error:", error);
    return Response.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
