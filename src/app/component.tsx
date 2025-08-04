'use client'
import { VideoDTO } from '@/models';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import ReactPlayer from 'react-player';

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      exit={{ x: 2000 }}
      className="lg:w-[40vw] w-[70vw] h-[60vw] lg:h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center"
    >
      <div className="h-[10vh] w-[10vh] lg:h-[20vh] lg:w-[20vh] bg-[#2A2222] rounded-full" />
      <div className="h-[10vh] w-[10vh]  lg:h-[20vh] lg:w-[20vh] bg-[#2A2222] rounded-full" />
    </motion.div>
  );
}

export function VideoComponent(
  props: { video: VideoDTO, key: number }
) {
  const [error, setError] = useState<string>("");

  return <div className='text-[#EEF4D4] lg:h-[30vh] h-[36vh] md:h-[25vh] rounded-md flex flex-col justify-end items-center md:m-5'>

    <div className="w-full h-[75%] bg-[#EEF4D4] rounded-md">
      {!error && <Image
        src={props.video.thumbnail}
        alt={props.video.title}
        width={160}
        height={90}
        onError={() => {
          setError("Failed to load thumbnail");
        }}
      />}
    </div>

    <div className="w-full mt-2 flex  items-center space-x-2">
      <button className="h-[5vh] w-[5vh] rounded-[50%] bg-[#EEF4D4] text-[#2A2222] font-black flex justify-center items-center text-center text-2xl">{props.video.userName[0]}</button>
      <div className='w-full'>
        <p className="text-sm font-black mb-3">{props.video.title}</p>
        <div className='flex space-y-1 justify-between w-full'>
          <p className=" text-xs">{
            props.video.userName
          }</p>
          <p className="text-xs">{Intl.NumberFormat('en', { notation: "compact" }).format(props.video.viewCount)
          } views • {props.video.createdAt} day ago</p>
        </div>
      </div>
    </div>
  </div>
}

export function AddVideo() {
  const [index, setIndex] = useState<number>(1);
  const videoRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const items = [
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <input type="file" id="vid" className='hidden' ref={videoRef} accept='video/*' onChange={
        () => {
          const file = videoRef.current?.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setFile(file);
            setVideoUrl(url);
          }
        }
      } />
      {file ?
      <div className='w-[80%] h-[60%] bg-[#6e5656] rounded-md flex justify-center items-center' onClick={
            () => {
              videoRef.current?.click();
            }}>
        <ReactPlayer src={videoUrl} style={{
          width: "100%",
          height: "100%",

        }}
        controls={true}
        autoPlay = {true}
          ></ReactPlayer></div> :
        <div className='w-[80%] h-[60%] bg-[#EEF4D4] rounded-md text-2xl flex justify-center items-center text-[#2A2222] font-bold cursor-pointer hover:bg-amber-50' onClick={
          () => {
            videoRef.current?.click();
          }}>
          <FaUpload className='text-4xl text-[#2A2222]' />
        </div>
      }
      <h2 className='text-[#EEF4D4] text-xl'>Upload your video </h2>
      <button className='bg-[#EEF4D4] outline-0 p-4 text-md rounded-md relative right-[-45%] bottom-[-10%] cursor-pointer hover:bg-[#e6f3a9]'>Next</button>
    </div>,

    <div className='flex flex-col justify-center items-center h-full w-full'>
      <input type="file" accept='image/*' className='hidden' id='thumbnail'  onChange={(e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setImageFile(file);
          setImageUrl(url);
        }
      }  }/>
      {imageFile ?
        <div className='w-[60%] h-[40%] bg-[#6e5656] rounded-md flex justify-center items-center' onClick={
          () => {
            const input = document.getElementById("thumbnail") as HTMLInputElement;
            input.click();
          }}>
          <Image src={imageUrl
          } alt="thumbnail" width={160} height={90} className='w-full h-full object-cover' />
        </div> :
        <div className='w-[80%] h-[60%] bg-[#EEF4D4] rounded-md text-2xl flex justify-center items-center text-[#2A2222] font-bold cursor-pointer hover:bg-amber-50' onClick={
          () => {
            const input = document.getElementById("thumbnail") as HTMLInputElement;
            input.click();
          }}>
          <FaUpload className='text-4xl text-[#2A2222]' />
        </div>
      } 

      <h2 className='text-[#EEF4D4] text-xl'>Add a title</h2>
      <input type="text" placeholder='Title' className='bg-[#EEF4D4] outline-0 p-4 text-md rounded-md w-[80%] mt-2' />

      <h2 className='text-[#EEF4D4] text-xl mt-4'>Add a description</h2>
      <input type="text" placeholder='description' className='bg-[#EEF4D4] outline-0 p-4 text-md rounded-md w-[80%] mt-2 ' />
    </div>  
  ]

  return <div className='absolute bg-[#4d3e3e] flex justify-center items-center w-[60vw] h-[65vh] border-8 border-amber-50 rounded-lg shadow-lg left-70 top-30'>
    {items[index]}
  </div>
}