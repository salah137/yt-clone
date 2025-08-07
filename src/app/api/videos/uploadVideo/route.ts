import { upload } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(req: NextRequest) {
  try {

    let userId;

    const formData = await req.formData();
    const videoFile = formData.get("video") as File;
    const thumbnailFile = formData.get("thumbnail") as File;
    console.log(thumbnailFile);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;


    if (!videoFile || !thumbnailFile || !title || !description) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
      const decoded: any = jwt.verify(token, process.env.TOKEN!);
      userId = decoded.userId;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // Here you would typically handle the upload logic, e.g., saving to a database or cloud storage
    const videoId = (await upload(videoFile)) as unknown as { secure_url: string, publicId: string };
    if (!videoId) {
      return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
    }
    
    const thumbnailId = await upload(thumbnailFile) as unknown as { secure_url: string, publicId: string };
    if (!thumbnailId) {
      return NextResponse.json({ error: "Failed to upload thumbnail" }, { status: 500 });
    }

    console.log(thumbnailId);
    
    try {
      await prisma.video.create({
        data: { title, description, url: videoId.publicId, thumbnail: thumbnailId.publicId, userId }
      });
    } catch (err) {
      console.error("Prisma DB insert error:", err);
      return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Video uploaded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error uploading video:", error);
    return new Response(JSON.stringify({ error: "Failed to upload video" }), { status: 500 });
  }


}