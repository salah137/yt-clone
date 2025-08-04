"use client";

import { Logo } from "@/app/component";
import { AnimatePresence, motion } from "framer-motion";
import ky from "ky";
import { useEffect, useState } from "react";

export default function Page() {
  const [verified, setVerified] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await ky.post("/api/auth/check", {
          credentials: "include",
          throwHttpErrors: false
        });

        const data = await response.json();
        console.log("Verification result:", data);

        setVerified(true);
      } catch (error) {
        console.error("Verification failed:", error);
        setVerified(false);
      } finally {
        setDone(true);
      }
    })();
  }, []);

  if (!done) {
    // Optional loading UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2222] text-[#EEF4D4]">
        <p>Verifying email...</p>
      </div>
    );
  }

  return (<div className="min-h-screen flex items-center justify-center bg-[#2A2222]">
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0.5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-[40vw] flex flex-col items-center justify-center"
      >
        <Logo />

        <h1 className="text-[#EEF4D4] text-3xl font-bold mb-5 mt-5">
          {verified ? "Email Verified" : "Email Verification Failed"}
        </h1>
        <p className="text-[#DAEFB3] text-md mb-4">
          {verified
            ? "Your email has been successfully verified."
            : "Your email could not be verified. Please try again later."}
        </p>
      </motion.div>
    </AnimatePresence>
  </div>

  );
}
