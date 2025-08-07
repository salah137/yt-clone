"use client";

import Loader from "@/app/component";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import ReactPlayer from "react-player";
/*
        id: video.id,
        title: video.title,
        description: video.description,
        url: videoUrl,
        thumbnail: video.thumbnail,
        userId: video.userId,
        userName : video.user.name,
        viewCount: video.viewCount,
        likeCount: video.likeCount,
        dislikeCount: video.dislikeCount,
        createdAt: video.createdAt.toISOString(),
        */


export default function WatchPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/getVideo/?id=${videoId}`);
        console.log(res);
        
        if (!res.ok) {
          throw new Error("Video not found");
        }
        const data = await res.json()
        setVideo(data);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-[#2A2222]">

        <Loader />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2222]">
        <p className="text-red-500 text-lg">Video not found.</p>
      </div>
    );
  }

  return <div className=" bg-[#2A2222] text-[#EEF4D4] p-4 flex flex-col items-start w-[70vw]">
      <div className="mb-4 h-[70vh]">
        <ReactPlayer src={video.url} height={"100%"} width={"100%"} controls={true}/>
      </div>
      <h1 className="text-4xl font-black mb-2">{video.title}</h1>

      <div className="flex w-[15vw] justify-center text-xl m-5">

        <div className="flex w-full border-EEF4D4 border-4 justify-around items-center h-[5h] py-4 rounded-lg">
          <BiLike />
          <span className="">{video.likeCount}</span>
        </div>
      
        <div className="flex w-full border-EEF4D4 border-4 justify-around items-center h-[5h] py-4 rounded-lg">
          <BiDislike />
          <span className="">{video.dislikeCount}</span>
        </div>
      
      </div>
      <div className="border-t-[#EEF4D4] border-t-3 w-full p-5">
          <div className="w-full flex justify-between">
            <p>
              views <span className="font-black">{video.viewCount}</span>
            </p>
            <p className="font-black">
              {video.createdAt}
            </p>
             </div>
          <p>{video.description}</p>
      </div>

  </div>

}
