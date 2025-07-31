"use client";

import { AnimatePresence, motion } from "framer-motion";
import ky from "ky";
import { useState } from "react";

export default function Verify() { 
    const [visible, setVisible] = useState(true);

    return (
        <AnimatePresence mode="wait">
            {visible && <div className="min-h-screen flex items-center justify-center bg-[#2A2222]">
                <motion.div
                    initial={{ x: -2000 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="w-[40vw] h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center"
                    exit={{ y: -2000 }}
                >
                    <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
                    <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0.5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className='ml-5 w-[40vw] flex flex-col items-center justify-center p-5'
                >
                    <h1 className='text-[#EEF4D4] text-3xl font-bold mb-5'>Verify Your Email</h1>
                    <motion.button onClick={
                        () => {
                            setVisible(false);
                            const res = ky.post('/api/auth/verify', {   
                                json: {
                                    id: localStorage.getItem("userId")
                                }
                            }).then((response) => {
                               const data = response.json()
                               console.log(data);
                            });   
                        }
                    } initial={{ y: 20, opacity: 0.5 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.75 }} className="bg-[#EEF4D4] text-sm h-[5vh] m-5 text-black px-4 py-2 rounded-md font-semibold cursor-pointer ">Send Verfication Email</motion.button>
                    <p className='text-[#DAEFB3] text-md mb-4'>Please check your email for a verification link.</p>
                </motion.div>
            </div>}
        </AnimatePresence>
    );
}
