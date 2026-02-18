import connectDB from "@/lib/db";
import MeterReading from "@/models/MeterReading";

/* =====================================
   GET READINGS BY TYPE
===================================== */
export async function GET(req, context) {
  try {
    const params = await context.params; // ✅ Next 16 fix
    const { type } = params;

    if (!type) {
      return Response.json(
        { message: "Meter type required" },
        { status: 400 }
      );
    }

    await connectDB();

    const data = await MeterReading.find({
      type: type.toUpperCase(),
    }).sort({ readingDate: 1 });

    return Response.json(data);

  } catch (error) {
    console.error("GET Meter Error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


/* =====================================
   POST NEW READING
===================================== */
export async function POST(req, context) {
  try {
    const params = await context.params; // ✅ Next 16 fix
    const { type } = params;

    if (!type) {
      return Response.json(
        { message: "Meter type required" },
        { status: 400 }
      );
    }

    await connectDB();

    const { value } = await req.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🚫 Prevent multiple entries same day
    const existing = await MeterReading.findOne({
      type: type.toUpperCase(),
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

    // ✅ Create reading
    await MeterReading.create({
      type: type.toUpperCase(),
      value,
      readingDate: new Date(),
    });

    // 🧹 30-day cleanup
    await MeterReading.deleteMany({
      type: type.toUpperCase(),
      readingDate: {
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    return Response.json(
      { message: "Reading added successfully" },
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
