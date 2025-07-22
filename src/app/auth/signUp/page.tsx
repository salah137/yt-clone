"use client";
import { Logo } from '@/app/component';
import gsap from 'gsap';

import { useEffect, useRef, useState } from "react";

export default function SignUpWrapper() {
    const [show, setShow] = useState(true);
    return (<>
        {show && <div className="flex items-center justify-center min-h-screen bg-[#2A2222] overflow-hidden">
            <SignUp exit={() => {
                setShow(false)
            }} />
        </div>}
    </>
    );
}

function SignUp({ exit }) {
    // Refs for GSAP animations
    const containerRef = useRef(null);
    const face = useRef(null);
    const form = useRef(null);
    const link = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.from(containerRef.current, {
            duration: 0.4,
            opacity: 0,
            y: 50,
            ease: 'power2.out',
        })
            .from(face.current, {
                duration: 0.6,
                x: -2000,
                scale: 0.8,
                ease: 'back.out(1.7)',
            })
            .from(form.current, {
                duration: 0.4,
                opacity: 0,
                y: 20,
                ease: 'power2.out',
            })
            .from(link.current, {
                duration: 0.4,
                opacity: 0,
                y: 10,
                ease: 'power2.inOut',
            });
    }, []);

    const handleExit = () => {
        gsap.to(face.current, {
            x: 2000,
            duration: 0.5,
        });
        gsap.to(form.current, {
            x: -2000,
            duration: 0.5,
        });
        exit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2A2222]" ref={containerRef}>
            {/* Robot face */}
            <Logo reff={face} />


            <div className='ml-5 w-[40vw] flex flex-col items-center justify-center p-5' ref={form}>
                <h1 className='text-[#EEF4D4] text-3xl font-bold mb-5'>Sign Up</h1>
                <div className='h-[5vh]'></div>
                {/* Input fields */}
                <input type="text" placeholder="Enter your name" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />
                <input type="text" placeholder="Enter your email" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />
                <input type="password" placeholder="Enter your password" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />
                <input type="password" placeholder="confirm your password" className="bg-[#2A2222] text-[#DAEFB3] px-4 py-2 rounded-md mb-4 w-full border-b-2 outline-none" />


                <button onClick={handleExit} className="bg-[#EEF4D4] text-sm h-[5vh] m-5 text-black px-4 py-2 rounded-md font-semibold cursor-pointer " >
                    Sign Up
                </button>

                <div>

                    {/* Link to sign in */}
                    <div className="text-[#EEF4D4] text-sm font-semibold " ref={link} >
                        Already have an account?<span className='text-[#DAEFB3] cursor-pointer hover:font-black' > Sign in</span>
                    </div>

                </div>
            </div>
        </div>
    );
}