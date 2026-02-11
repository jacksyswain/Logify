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
    // 1️⃣ Session check
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Role check
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "TECHNICIAN"
    ) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3️⃣ Parse body
    const { title, descriptionMarkdown, images = [] } = await req.json();

    if (!title || !descriptionMarkdown) {
      return Response.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Connect DB
    await connectDB();

    // 5️⃣ Create ticket with INITIAL ACTIVITY
    const ticket = await Ticket.create({
      title,
      descriptionMarkdown,
      images,
      status: "OPEN",
      createdBy: session.user.id,
      markedDownBy: null,

      // ✅ IMPORTANT: initial activity
      statusHistory: [
        {
          status: "OPEN",
          changedBy: session.user.id,
          changedAt: new Date(),
        },
      ],
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
    // 1️⃣ Optional session
    const session = await getServerSession(authOptions);

    // 2️⃣ Connect DB
    await connectDB();

    // 3️⃣ Fetch tickets
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role")
      .populate("markedDownBy", "name email role");

    // 4️⃣ Public users → limited fields
    if (!session) {
      return Response.json(
        tickets.map((t) => ({
          _id: t._id,
          title: t.title,
          descriptionMarkdown: t.descriptionMarkdown,
          images: t.images,
          status: t.status,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
        { status: 200 }
      );
    }

    // 5️⃣ Authenticated users → full data
    return Response.json(tickets, { status: 200 });
  } catch (error) {
    console.error("GET /api/tickets error:", error);
    return Response.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
