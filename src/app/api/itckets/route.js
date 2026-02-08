import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

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
    const role = session.user.role;
    if (role !== "ADMIN" && role !== "TECHNICIAN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 3️⃣ Parse request body
    const { title, descriptionMarkdown } = await req.json();

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
      createdBy: session.user.id, // 👈 from session
      // createdAt & updatedAt auto-added by mongoose timestamps
    });

    return Response.json(
      {
        message: "Ticket created successfully",
        ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
