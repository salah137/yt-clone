'use client'
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      exit={{ x:2000 }}
      className="lg:w-[40vw] w-[70vw] h-[60vw] lg:h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center"
    >
      <div className="h-[10vh] w-[10vh] lg:h-[20vh] lg:w-[20vh] bg-[#2A2222] rounded-full" />
      <div className="h-[10vh] w-[10vh]  lg:h-[20vh] lg:w-[20vh] bg-[#2A2222] rounded-full" />
    </motion.div>
  );
}
