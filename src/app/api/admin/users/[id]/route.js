import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

/* =====================================
   PATCH /api/admin/users/:id
   Admin: update user role
===================================== */
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // 🔐 Admin guard
    if (!session || session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { role } = await req.json();

    if (!role || !["ADMIN", "TECHNICIAN"].includes(role)) {
      return Response.json(
        { message: "Invalid role" },
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

    // Optional safety: prevent demoting yourself
    if (user._id.toString() === session.user.id) {
      return Response.json(
        { message: "You cannot change your own role" },
        { status: 400 }
      );
    }

    user.role = role;
    await user.save();

    return Response.json(
      {
        message: "Role updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Role Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
