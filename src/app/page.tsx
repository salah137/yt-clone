"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { AddVideo, VideoComponent } from "./component";
import { VideoDTO } from "@/models";

import ky from "ky";
import { IoIosAdd } from "react-icons/io";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isBottom, setIsBottom] = useState(true);
  const [videos, setVideos] = useState<VideoDTO[]>([]);

  useEffect(() => {
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        setIsBottom(true);
      } else {
        
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  },[])

  useEffect(() => {
      (async () => {
        try {

          if (isBottom) {
          
          const response = await ky.get("/api/videos/getAllVideos?skip="+videos.length,) ;
          const data = await response.json() as {data: VideoDTO[]};
          console.log(data.data);
          setVideos((prevVideos) => [...prevVideos, ...data.data]);

          setIsBottom(false);
      }

        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      })();
  }, [isBottom]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName!);
    console.log(`Welcome, ${userName}!`);

  }, []);

  return (
    <div>
      <header className="bg-[#2A2222] flex flex-row justify-between items-center p-4">
        <button className="h-[5vh] w-[5vh] rounded-[50%] bg-[#EEF4D4] text-[#2A2222] font-black flex justify-center items-center text-center text-2xl">{userName[0]}</button>
        <div className="text-[#EEF4D4 ] text-2xl font-bold ml-4  flex items-center justify-center">
          <div className="flex items-center justify-center border-5 text-[#EEF4D4] border-[#EEF4D4] p-3 color-[#EEF4D4]">
            <CiSearch />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-[#2A2222] text-[#EEF4D4] px-4 py-[11px] outline-none border-b-5  border-[#EEF4D4] w-[30vw]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value;
                if (query) {
                  router.push(`/search/${query}`);
                }
              }
            }}
          />

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          exit={{ x: 2000 }}
          className="lg:w-[7.5vw] w-[7.5vw] h-[5vw] lg:h-[7vh] bg-[#EEF4D4] rounded-md flex justify-around items-center"
        >
          <div className="h-[1vh] w-[10vh] lg:h-[4vh] lg:w-[4vh] bg-[#2A2222] rounded-full" />
          <div className="h-[10vh] w-[10vh]  lg:h-[4vh] lg:w-[4vh] bg-[#2A2222] rounded-full" />
        </motion.div>

      </header>

      <main className="flex flex-col lg:grid lg:grid-cols-4 md:grid md:grid-cols-2 gap-2 p-4">
        {videos.map((video) => {
          return <VideoComponent video={video} key={1} /> })}
      </main>

      <button
        className="flex justify-around items-center fixed bottom-4 h-[20vw] w-|20vh] lg:h-fit right-4 bg-[#EEF4D4] text-[#2A2222] p-3 rounded-full shadow-lg lg:w-[10vw]  hover:bg-[#eeecec] cursor-pointer"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <IoIosAdd className="text-2xl"/>

        <span className="text-[#2A2222] hidden lg:inline">Upload video</span>
      </button>

      <AddVideo />
    </div>
  );
}
