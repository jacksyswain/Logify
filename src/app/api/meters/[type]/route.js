import connectDB from "@/lib/db";
import MeterReading from "@/models/MeterReading";

/* =====================================================
   GET  /api/meters/[type]
   Returns all readings for GAS or WATER
===================================================== */
export async function GET(req, context) {
  try {
    const params = await context.params; // ✅ Required in Next 16
    const { type } = params;

    if (!type) {
      return Response.json(
        { message: "Meter type is required" },
        { status: 400 }
      );
    }

    const meterType = type.toUpperCase();

    if (!["GAS", "WATER"].includes(meterType)) {
      return Response.json(
        { message: "Invalid meter type" },
        { status: 400 }
      );
    }

    await connectDB();

    const readings = await MeterReading.find({
      type: meterType,
    }).sort({ readingDate: 1 });

    return Response.json(readings, { status: 200 });

  } catch (error) {
    console.error("GET Meter Error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


/* =====================================================
   POST  /api/meters/[type]
   Adds today's reading (only once per day)
   Also keeps only last 30 days
===================================================== */
export async function POST(req, context) {
  try {
    const params = await context.params; // ✅ Required in Next 16
    const { type } = params;

    if (!type) {
      return Response.json(
        { message: "Meter type is required" },
        { status: 400 }
      );
    }

    const meterType = type.toUpperCase();

    if (!["GAS", "WATER"].includes(meterType)) {
      return Response.json(
        { message: "Invalid meter type" },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { value } = body;

    if (value === undefined || value === null) {
      return Response.json(
        { message: "Reading value is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Prevent duplicate entry for same day
    const existing = await MeterReading.findOne({
      type: meterType,
      readingDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 86400000),
      },
    });

    if (existing) {
      return Response.json(
        { message: "Today's reading already added" },
        { status: 400 }
      );
    }

    // ✅ Create new reading
    const newReading = await MeterReading.create({
      type: meterType,
      value: Number(value),
      readingDate: new Date(),
    });

    // ✅ Keep only last 30 days
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    await MeterReading.deleteMany({
      type: meterType,
      readingDate: { $lt: thirtyDaysAgo },
    });

    return Response.json(
      {
        message: "Reading added successfully",
        reading: newReading,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Meter Error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
