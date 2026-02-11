import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";

/* ================================
   GET /api/tickets/:id/comments
================================ */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const ticket = await Ticket.findById(params.id)
      .populate("comments.author", "name email role");

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(ticket.comments, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/* ================================
   POST /api/tickets/:id/comments
================================ */
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message.trim()) {
      return Response.json(
        { message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await Ticket.findById(params.id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    ticket.comments.push({
      message,
      author: session.user.id,
    });

    await ticket.save();

    return Response.json(
      { message: "Comment added" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Failed to add comment" },
      { status: 500 }
    );
  }
}
