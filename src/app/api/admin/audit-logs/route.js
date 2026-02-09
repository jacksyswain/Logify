import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import AuditLog from "@/models/AuditLog";

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

    const logs = await AuditLog.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    return Response.json(logs, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
