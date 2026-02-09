import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import connectDB from "../src/lib/db.js";
import User from "../src/models/User.js";

async function seedAdmin() {
  try {
    console.log("🌱 Seeding default admin...");
    console.log("🔌 Mongo URI exists:", !!process.env.MONGODB_URI);

    await connectDB();

    const adminEmail = "admin@logify.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Default Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log("✅ Admin user created successfully");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAdmin();
