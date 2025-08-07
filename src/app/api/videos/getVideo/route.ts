import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { subscribe } from "diagnostics_channel";
import { li } from "framer-motion/client";
import { NextResponse, NextRequest } from "next/server";

export  async function GET(req: NextRequest) {
  try {
    const videoId = req.nextUrl.searchParams.get("id");
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { user: true },
    });
    
    if (!video) {
      return new Response(JSON.stringify({ error: "Video not found" }), { status: 404 });
    }

    const videoUrl =  cloudinary.url(video.url, {
        resource_type: "video",
        transformation: [ 
        { width: 1920, height: 1080, crop: "fill", aspect_ratio: "16:9",  quality: "auto", fetch_format: "auto" },
      ], })

    const res = {
        id: video.id,
        title: video.title,
        description: video.description,
        url: videoUrl,
        userId: video.userId,
        userName : video.user.name,
        viewCount: video.viewCount,
        likeCount: video.likeCount,
        dislikeCount: video.dislikeCount,
        createdAt: video.createdAt.toISOString(),
    }

   

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}