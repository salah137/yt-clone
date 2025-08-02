"use client";
import { Logo } from "@/app/component";
import { AnimatePresence, motion } from "framer-motion";
import ky from "ky";
import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { useEffect } from "react";

export default function Page() {
    const params = useSearchParams();

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        (async () => {

                try {
                    const response = await ky.post('/api/auth/check', {
                        credentials: 'include',
                    });
                    const data = await response.json();
                    console.log(data);
                    setVisible(false);
                } catch (error) {
                    console.error("Verification failed:", error);
                }
            
        })();
    }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2A2222]">
      <div className="w-[40vw] h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center">
        <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
        <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
      </div>
    </div>
  );
}