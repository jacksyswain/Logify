import connectDB from "@/lib/db";
import ElectricityReading from "@/models/ElectricityReading";

export async function GET(req, { params }) {
  await connectDB();

  const readings = await ElectricityReading.find({
    meterId: params.id,
  }).sort({ readingDate: 1 });

  return Response.json(readings);
}

export async function POST(req, { params }) {
  await connectDB();

  const { value } = await req.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await ElectricityReading.findOne({
    meterId: params.id,
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

  await ElectricityReading.create({
    meterId: params.id,
    value,
  });

  await ElectricityReading.deleteMany({
    meterId: params.id,
    readingDate: {
      $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  return Response.json({ message: "Reading added" });
}
