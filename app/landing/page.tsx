'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {useRouter} from 'next/navigation';

const letters = ['M', 'E', 'E', 'T', 'I', 'N'];


const Landing = () => {
    const router = useRouter();
  return (
    <div className="flex flex-col font-mono font-extrabold text-5xl p-5 bg-amber-50 justify-center text-black items-center h-screen">
       <div className='flex '>
      {letters.map((letter, index) => {
        // Only "M" should not move
        const isMain = index === 0;

        return (
          <motion.div
            key={index}
            initial={{
              x: isMain ? 0 : -((index - 0) * 140), // move all from M's position
              y: 0,
              opacity: isMain ? 1 : 0,
              scale: isMain ? 1 : 0.3,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.20,
              type: 'spring',
              stiffness: 50,
            }}
            className={`${
              index < 4 ? 'w-32 h-32 text-5xl' : 'w-16 h-16 text-2xl mt-15'
            } ${index < 4 ? 'bg-amber-200' : 'bg-amber-100'} shadow-2xl shadow-amber-200 flex justify-center items-center m-0.5 rounded-3xl z-10`}
          >
            {letter}
          </motion.div>
        );
      })}
      </div> 
      <div >
        <button 
        className=' bg-amber-500 rounded-2xl text-2xl font-semibold'>
        Login</button>
    </div>
    </div> 
  );
};

export default Landing;
