"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ky from "ky";
import { set } from "zod";


export default function SignUp() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [error, setError] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2A2222]" >
            {/* Robot face */}
            <motion.div
                initial={{ x: -2000, }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="w-[40vw] h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center"
            >
                <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
                <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-full" />
            </motion.div>



            <motion.div initial={{ y: 20, opacity: 0.5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className='ml-5 w-[40vw] flex flex-col items-center justify-center p-5' >
                <h1 className='text-[#EEF4D4] text-3xl font-bold mb-5'>Sign Up</h1>
                <div className='h-[5vh]'></div>
                {/* Input fields */}
                <input value={data.name} onChange={
                    (e) => setData({ ...data, name: e.target.value })
                } type="text" placeholder="Enter your name" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />

                <input value={data.email} onChange={
                    (e) => setData({ ...data, email: e.target.value })
                } type="text" placeholder="Enter your email" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />

                <input value={data.password} onChange={
                    (e) => setData({ ...data, password: e.target.value })
                } type="password" placeholder="Enter your password" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />

                <input value={data.confirmPassword} onChange={
                    (e) => setData({ ...data, confirmPassword: e.target.value })
                } type="password" placeholder="confirm your password" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />

                {error && <motion.p 
                    initial={{ y: 20, opacity: 0.5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                className="text-red-500 text-md mb-4">{error}</motion.p>}

                <motion.button initial={{ y: 20, opacity: 0.5 }} animate={{ opacity: 1, y: 0 }} whileHover={
                    { scale: 1.25 }
                } whileTap={{ scale: 0.75 }
                } transition={{ duration: 1 }} onClick={async () => {
                    const { name, email, password, confirmPassword } = data;
                    if (!name || !email || !password || !confirmPassword) {
                        setError("All fields are required");
                        return;
                    }
                    if (password !== confirmPassword) {
                        setError("Passwords do not match");
                        return;
                    }
                    if (password.length < 6) {
                        setError("Password must be at least 6 characters");
                        return;
                    }
                    try {
                    const res = await ky.post("/api/auth/signUp", {
                        json: { name, email, password },
                        credentials: "include",
                        throwHttpErrors: false
                    })
                    if (res.status !== 201) {
                        const errorData = await res.json() as { error: string };
                        setError(errorData.error || "Something went wrong");
                    } else {
                        const data = await res.json();
                        console.log(data);
                        window.location.href = "/";
                    }
                    } catch (error) {
                        console.error("Error during sign up:", error);
                        setError("An error occurred while signing up. Please try again later.");
                    }
                }}
                    className="bg-[#EEF4D4] text-sm h-[5vh] m-5 text-black px-4 py-2 rounded-md font-semibold cursor-pointer " >
                    Sign Up
                </motion.button>

                <div>

                    {/* Link to sign in */}
                    <div className="text-[#EEF4D4] text-sm font-semibold "  >
                        Already have an account?<span className='text-[#DAEFB3] cursor-pointer hover:font-black' onClick={
                            () => {
                                window.location.href = "/auth/signIn";
                            }
                        } > Sign in</span>
                    </div>

                </div>
            </motion.div> </div>
    );

}