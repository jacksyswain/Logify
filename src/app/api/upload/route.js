import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    // 1️⃣ Auth check
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Read form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // 3️⃣ Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4️⃣ Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "logify",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return Response.json(
      {
        message: "Image uploaded successfully",
        url: uploadResult.secure_url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image Upload Error:", error);
    return Response.json(
      { message: "Image upload failed" },
      { status: 500 }
    );
  }
}
