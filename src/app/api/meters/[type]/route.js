import connectDB from "@/lib/db";
import MeterReading from "@/models/MeterReading";

export async function GET(req, { params }) {
  await connectDB();

  const data = await MeterReading.find({
    type: params.type.toUpperCase(),
  }).sort({ readingDate: 1 });

  return Response.json(data);
}

export async function POST(req, { params }) {
  await connectDB();

  const { value } = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // prevent multiple entries same day
  const existing = await MeterReading.findOne({
    type: params.type.toUpperCase(),
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

  await MeterReading.create({
    type: params.type.toUpperCase(),
    value,
  });

  // 30-day cleanup
  await MeterReading.deleteMany({
    type: params.type.toUpperCase(),
    readingDate: {
      $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  return Response.json({ message: "Reading added" });
}
