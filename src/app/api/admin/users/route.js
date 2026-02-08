import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/* =====================================
   GET /api/admin/users
   Admin: fetch all users
===================================== */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Get Users Error:", error);
    return Response.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/* =====================================
   POST /api/admin/users
   Admin: create user
===================================== */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "TECHNICIAN",
    });

    return Response.json(
      {
        message: "User created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create User Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
