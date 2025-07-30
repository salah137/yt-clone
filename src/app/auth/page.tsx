"use client"
import { Logo } from '../component';
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthCard({ }) {
    const router = useRouter();
    const [visible,setVisible] = useState(true);
    
    return (
        <AnimatePresence mode="wait">
            {visible &&
            <div className="min-h-screen flex items-center justify-center bg-[#2A2222] overflow-hidden" >
                <div className="flex flex-col items-center space-y-4">
                    {/* Robot face */}
                    <Logo />

                    {/* Sign up button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        initial={{
                            opacity: 0, y: -20
                        }}
                        animate={{
                            opacity: 1, y: 0
                        }}
                        transition={{ duration: 1 }}
                        exit={{ opacity: 0, y: -20 }
                        }
                        onClick={() => {
                            setVisible(false);
                            setTimeout(() => {
                                router.push('/auth/signUp');
                            },1000);
                        }} className="bg-[#EEF4D4] text-3xl h-[10vh] m-5 text-black px-4 py-2 rounded-md font-semibold cursor-pointer " >
                        Get Started
                    </motion.button>

                    {/* Bottom sign up link */}
                    <motion.button  initial={{
                            opacity: 0, y: -20
                        }}
                        animate={{
                            opacity: 1, y: 0
                        }}
                        transition={{ duration: 1 }}
                        exit={{ opacity: 0, y: -20 }} className="w-24 h-[10px] bg-[#EEF4D4] rounded-md"></motion.button>


                    <motion.button  initial={{
                            opacity: 0, y: -20
                        }}
                        animate={{
                            opacity: 1, y: 0
                        }}
                        transition={{ duration: 1 }}
                        exit={{ opacity: 0, y: -20 }} className="text-[#EEF4D4] text-sm font-semibold " >
                        Already have an account?<span className='text-[#DAEFB3] cursor-pointer hover:font-black'     onClick={() => {
                            setVisible(false);
                            setTimeout(() => {
                                router.push('/auth/signIn');
                            },1000);
                        }} > Sign in</span>
                    </motion.button>

                </div>
            </div> }
        </AnimatePresence>
    );
}
