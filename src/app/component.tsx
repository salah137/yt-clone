'use client'
import { VideoDTO } from '@/models';
import { AnimatePresence, motion } from 'framer-motion';
import ky from 'ky';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import ReactPlayer from 'react-player';
import { useEffect } from 'react';
import { Pause, Play, VolumeX, Volume2, Minimize2, Maximize2 } from 'lucide-react';
import clsx from 'clsx';
import screenfull from 'screenfull';

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
  props: { video: VideoDTO, key: number, onClick: () => void }
) {
  const [error, setError] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [triggered, setTriggered] = useState(false);

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Cancel if hover ends early
    }
    setTriggered(false); // Reset
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setTriggered(true); // Action after 10s hover
    }, 3000); // 10 seconds
  };



  return <div onClick={props.onClick} className='text-[#EEF4D4] lg:h-[30vh] h-[36vh] md:h-[25vh] rounded-md flex flex-col justify-end items-center md:m-5 cursor-pointer' onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>

    <div className="w-full h-[75%] bg-[#EEF4D4] rounded-md">
      {
        !triggered ? <Image

          src={props.video.thumbnail}
          alt={props.video.title}
          width={640}
          height={360}
          className="w-full h-full object-cover rounded-t-md"
          onError={() => {
            setError("Failed to load thumbnail");
          }}
        /> : <ReactPlayer
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={props.video.url}
          width="100%"
          height="100%"
          controls={false}
          autoPlay={true}
          onError={() => {
            setError("Failed to load video");
          }} />
      }
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

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-10 h-10 border-4 border-[#EEF4D4] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}


export function AddVideo(props: { onClose: () => void, }) {
  const [index, setIndex] = useState<number>(0);
  const videoRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState(
    {
      title: "",
      description: "",

    }
  );

  const [loading, setLoading] = useState<boolean>(false);

  const items = [
    // STEP 1: Video Upload
    <div
      className="flex flex-col justify-center items-center h-full w-full" key="video-upload">
      <input
        type="file"
        id="vid"
        ref={videoRef}
        accept="video/*"
        className="hidden"
        onChange={() => {
          const file = videoRef.current?.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setFile(file);
            setVideoUrl(url);
          }
        }}
      />

      <div
        className={`lg:w-[80%] lg:h-[60%] rounded-md flex justify-center items-center cursor-pointer ${file ? 'bg-[#6e5656]' : 'bg-[#e6f3a9] hover:bg-amber-50 text-2xl text-[#2A2222] font-bold'
          }`}
        onClick={() => videoRef.current?.click()}
      >
        {file ? (
          <ReactPlayer
            src={videoUrl}
            style={{ width: '100%', height: '100%' }}
            controls
            autoPlay
          />
        ) : (
          <FaUpload className="text-4xl text-[#2A2222]" />
        )}
      </div>

      <h2 className="text-[#EEF4D4] text-xl mt-4">Upload your video</h2>
      <button className="bg-[#EEF4D4] mt-4 p-4 text-md rounded-md hover:bg-[#e6f3a9]" onClick={() => {
        if (videoUrl) {
          setIndex(1);
        }
        else {
          setError("Please upload a video file.");
        }
      }}>
        Next
      </button>
      {
        error && <p className="text-red-500 mt-2">{error}</p>
      }
    </div>,

    // STEP 2: Thumbnail & Metadata
    <div className="flex flex-col justify-center items-center h-full w-full" key="thumbnail-step">
      <input
        type="file"
        id="thumbnail"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setImageFile(file);
            setImageUrl(url);
          }
        }}
      />

      <div
        className={`lg:w-[80%] lg:h-[60%] rounded-md flex justify-center items-center cursor-pointer ${imageFile ? 'bg-[#463939]' : 'bg-[#EEF4D4] hover:bg-amber-50 text-2xl text-[#2A2222] font-bold'
          }`}
        onClick={() => {
          const input = document.getElementById('thumbnail') as HTMLInputElement;
          input.click();
        }}
      >
        {imageFile ? (
          <Image
            src={imageUrl}
            alt="thumbnail"
            width={160}
            height={90}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUpload className="text-4xl text-[#2A2222]" />
        )}
      </div>

      <h2 className="text-[#EEF4D4] text-xl mt-4">Add a title</h2>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        type="text"
        placeholder="Title"
        className="bg-[#EEF4D4] outline-0 p-4 text-md rounded-md w-[80%] mt-2"
      />

      <h2 className="text-[#EEF4D4] text-xl mt-4">Add a description</h2>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
        className="bg-[#EEF4D4] outline-0 p-4 text-md rounded-md w-[80%] mt-2"
      />

      <div className="flex justify-between w-[80%] mt-6">
        <button className="bg-[#EEF4D4] p-4 text-md rounded-md hover:bg-[#e6f3a9]" onClick={
          () => setIndex(0)

        }>
          Previous
        </button>
        <button className="bg-[#EEF4D4] p-4 text-md rounded-md hover:bg-[#e6f3a9]" onClick={async () => {
          if (imageFile && formData.title && formData.description) {
            setLoading(true);
            // Here you would typically handle the upload logic
            const formDataToSend = new FormData();
            formDataToSend.append('video', file!);
            formDataToSend.append('thumbnail', imageFile);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);

            await ky.post('/api/videos/uploadVideo', {
              body: formDataToSend,
              timeout: false,
            }).then(() => {
              setLoading(false);
              props.onClose();
            }).catch((err) => {
              console.error("Upload failed:", err);
              setError("Failed to upload video.");
            })
          } else {
            setError("Please fill all fields and upload a thumbnail.");
          }
        }}>
          Done
        </button>
      </div>
    </div>,
  ];


  return <motion.div initial={
    {
      opacity: 0, scale: 0.95
    }
  }
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className='absolute bg-[#4d3e3e] flex justify-center items-center w-[100vw] h-[100vh] lg:w-[63vw] lg:h-[80vh]  rounded-[5%] shadow-lg lg:left-70 lg:top-30  top-15 p-3'>
    <AnimatePresence mode="wait">
      <button className=' bg-[#EEF4D4] p-3 rounded-full absolute top-3 right-3 text-[#2A2222] text-2xl font-bold hover:bg-[#e6f3a9]' onClick={props.onClose}>
        <IoMdClose />

      </button>
      <motion.div
        key={index} // key must change
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        {loading ? <Loader /> : items[index]}
      </motion.div>
    </AnimatePresence>

  </motion.div>
}




