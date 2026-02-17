import connectDB from "@/lib/db";
import ElectricityMeter from "@/models/ElectricityMeter";

export async function GET() {
  await connectDB();
  const meters = await ElectricityMeter.find().sort({ createdAt: -1 });
  return Response.json(meters);
}

export async function POST(req) {
  await connectDB();
  const { meterNumber, location } = await req.json();

  const meter = await ElectricityMeter.create({
    meterNumber,
    location,
  });

  return Response.json(meter);
}
