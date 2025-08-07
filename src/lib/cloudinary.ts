import { v2 as cloudinary } from "cloudinary";
import { unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";


const MAX_FILE_SIZE = 500 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  // Videos
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // for .mov files
];


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;



export async function upload(file: File) {
  try {

    if (!file) {
       return "No file found";
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return  "Invalid file type. Only JPEG, PNG, and WebP are allowed."
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const osTmpDir = path.join(process.cwd(), "tmp");
    const tmpPath = path.join(osTmpDir, file.name);

    
    try {
      await writeFile(tmpPath, buffer);

      const uploadResult = await cloudinary.uploader.upload(tmpPath, {
        folder: "profiles",
        resource_type: "auto", // Let Cloudinary detect the file type
      });

      // Clean up the temporary file
      await unlink(tmpPath);

      return ({ 
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id 
      });
    } catch (uploadError) {
      // Ensure tmp file is deleted even if upload fails
      await unlink(tmpPath).catch(unlinkError => 
        console.error("Failed to delete temp file:", unlinkError)
      );
      throw uploadError;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return   "Failed to upload file" 
   
  }
}