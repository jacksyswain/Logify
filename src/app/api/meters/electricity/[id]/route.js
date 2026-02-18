import connectDB from "@/lib/db";
import ElectricityReading from "@/models/ElectricityReading";

/* ================================
   GET Electricity Readings
================================ */
export async function GET(req, context) {
  try {
    const params = await context.params; // ✅ unwrap promise
    const { id } = params;

    if (!id) {
      return Response.json(
        { message: "Meter ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const readings = await ElectricityReading.find({
      meterId: id,
    }).sort({ readingDate: 1 });

    return Response.json(readings);

  } catch (error) {
    console.error("GET Electricity Error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* ================================
   POST Electricity Reading
================================ */
export async function POST(req, context) {
  try {
    const params = await context.params; // ✅ unwrap promise
    const { id } = params;

    if (!id) {
      return Response.json(
        { message: "Meter ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const { value } = await req.json();

    if (!value) {
      return Response.json(
        { message: "Reading value required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prevent duplicate entry same day
    const existing = await ElectricityReading.findOne({
      meterId: id,
      readingDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 86400000),
      },
    });

    if (existing) {
      return Response.json(
        { message: "Today's reading already exists" },
        { status: 400 }
      );
    }

    await ElectricityReading.create({
      meterId: id, // ✅ now defined
      value: Number(value),
      readingDate: new Date(),
    });

    return Response.json(
      { message: "Reading added successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Electricity Error:", error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
