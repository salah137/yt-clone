"use client";

import Loader from "@/app/component";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import ReactPlayer from "react-player";
import { Comments } from "../component";
import { WatchVideo } from "@/models";

export default function WatchPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState<WatchVideo>();
  const [loading, setLoading] = useState(true);
  const [like, setLiking] = useState(false)
  const [dislike, setdisLiking] = useState(false)

  useEffect(() => {


    const handleUnload = async () => {
      // Trigger your logic here, e.g. call an API or update user status
      console.log("User is closing the page or refreshing.");
      // You can use fetch here with `keepalive: true`
      navigator.sendBeacon(
        "/api/video/endWatching",
        new Blob(
          [
            JSON.stringify({
              videoId: videoId,
              like: like,
              dislike: dislike
            })
          ],
          { type: "application/json" }
        )
      );

    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);



  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/getVideo/?id=${videoId}`);
        console.log(res);

        if (!res.ok) {
          throw new Error("Video not found");
        }
        const data = await res.json() as unknown as WatchVideo

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

  return <div className="w-[100vw] h-[100vh] flex flex-col lg:flex-row items-center overflow-scroll scrollbar-hide"> <div className="min-h-screen bg-[#2A2222] text-[#EEF4D4] p-4 flex flex-col items-start lg:w-[70vw] overflow-scroll scrollbar-hide">
    <div className="mb-4 lg:h-[70vh]">
      <ReactPlayer src={video.url} height={"100%"} width={"100%"} controls={true} />
    </div>
    <h1 className="text-4xl font-black mb-5">{video.title}</h1>

    <div className="flex w-full lg:w-[15vw] justify-center text-xl ">

      <div className="flex w-full border-EEF4D4 border-4 rounded-lg justify-around items-center h-[5h] py-4  mr-3" onClick={
        () => {
          setdisLiking(false)
          setLiking(l => !l)
        }
      }>
        {like ? <BiSolidLike /> : <BiLike className="text-3xl" />}
        <span className="">{like ? video.likeCount + 1 : video.likeCount}</span>
      </div>

      <div className="flex w-full border-EEF4D4 border-4 rounded-lg justify-around items-center h-[5h] py-4  ml-3" onClick={
        () => {
          setLiking(false)
          setdisLiking(l => !l)
        }
      }>
        {dislike ? <BiSolidDislike /> : <BiDislike className="text-3xl" />}
        <span className="">{dislike ? video.dislikeCount + 1 : video.dislikeCount}</span>
      </div>

    </div>
    <div className="border-t-[#EEF4D4] border-t-3 w-full p-5 mt-5">
      <div className="w-full flex justify-between">
        <p>
          views <span className="font-black">{video.viewCount}</span>
        </p>
        <p className="font-black">
          {new Date(video.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          }
        </p>
      </div>
      <p className="my-5">{video.description}</p>
    </div>

  </div>
    <Comments videoId={videoId!.toString()} />
  </div>

}