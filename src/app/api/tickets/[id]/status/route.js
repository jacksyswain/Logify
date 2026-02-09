import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

/* =====================================
   PATCH /api/admin/users/:id/status
   Admin: enable / disable user
===================================== */
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return Response.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent disabling yourself
    if (user._id.toString() === session.user.id) {
      return Response.json(
        { message: "You cannot disable your own account" },
        { status: 400 }
      );
    }

    user.isActive = isActive;
    await user.save();

    return Response.json(
      {
        message: `User ${
          isActive ? "enabled" : "disabled"
        } successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update User Status Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
