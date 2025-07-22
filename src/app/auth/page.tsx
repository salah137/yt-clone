"use client"
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

export default function SignUpWrapper() {
    const [show,setShow] = useState(true);
    return (<>
        { show && <div className="flex items-center justify-center min-h-screen bg-[#2A2222] overflow-hidden">
        <SignUpCard exit={()=>{
            setShow(false)
        }} />
        </div> }
    </>
    );
}

 function SignUpCard({exit}) {
    // Refs for GSAP animations
  const containerRef = useRef(null);
  const faceRef = useRef(null);
  const buttonRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      duration: 0.4,
      opacity: 0,
      y: 50,
      ease: 'power2.out',
    })
      .from(faceRef.current, {
        duration: 0.6,
        opacity: 0,
        y: -20,
        scale: 0.8,
        ease: 'back.out(1.7)',
      })
      .from(buttonRef.current, {
        duration: 0.4,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
      })
      .from(linkRef.current, {
        duration: 0.4,
        opacity: 0,
        y: 10,
        ease: 'power2.inOut',
      });
  }, []);

  const handleExit = () => {
    gsap.to(faceRef.current, {
        x : 2000,
        duration: 0.5,
    })
    gsap.to(buttonRef.current, {
        duration: 0.5,
        opacity: 0,
        });

     gsap.to(linkRef.current, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
                exit(); }
            }
        );
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A2222]" ref={containerRef}>
      <div className="flex flex-col items-center space-y-4">
        {/* Robot face */}
        <div className="w-[40vw] h-[25vw] bg-[#EEF4D4] rounded-md flex justify-around items-center" ref={faceRef}>
          <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-[50%]"></div>
          <div className="h-[20vh] w-[20vh] bg-[#2A2222] rounded-[50%]"></div>
        </div>

        {/* Sign up button */}
        <button  onClick={handleExit} className="bg-[#EEF4D4] text-3xl h-[10vh] m-5 text-black px-4 py-2 rounded-md font-semibold cursor-pointer hover:font-black" ref={buttonRef}>
            Get Started
        </button>

        {/* Bottom sign up link */}
          <div className="w-24 h-[10px] bg-[#EEF4D4] rounded-md"></div>
        

        <div className="text-[#EEF4D4] text-sm font-semibold " ref={linkRef} >
          Already have an account?<span className='text-[#DAEFB3] cursor-pointer hover:font-black' > Sign in</span>
        </div>

      </div>
    </div>
  );
}
