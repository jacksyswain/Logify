import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

/* =====================================
   PATCH /api/admin/users/:id
   Admin: update user role OR status
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
    const body = await req.json();
    const { role, isActive } = body;

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🚫 Prevent admin from changing own role
    if (role && user._id.toString() === session.user.id) {
      return Response.json(
        { message: "You cannot change your own role" },
        { status: 400 }
      );
    }

    /* ===============================
       Update Role (if provided)
    =============================== */
    if (role) {
      if (!["ADMIN", "TECHNICIAN"].includes(role)) {
        return Response.json(
          { message: "Invalid role" },
          { status: 400 }
        );
      }

      user.role = role;
    }

    /* ===============================
       Update Status (if provided)
    =============================== */
    if (typeof isActive === "boolean") {
      if (user._id.toString() === session.user.id) {
        return Response.json(
          { message: "You cannot disable your own account" },
          { status: 400 }
        );
      }

      user.isActive = isActive;
    }

    await user.save();

    return Response.json(
      {
        message: "User updated successfully",
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
    console.error("Update User Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
