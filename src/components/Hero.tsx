import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className='w-full h-screen relative'>
      <Image
        src={'/intro.jpg'}
        alt='no Image'
        fill
        className="w-full h-full object-fill hidden md:block"
        style={{ objectFit: 'cover' }}
      />
      <div className='w-full flex-col md:hidden h-full relative flex items-center px-3 justify-center text-center'>
        <Image
          src={'/mob-intro.jpg'}
          alt='no Image'
          fill
          style={{ objectFit: 'cover' }}
        />
        <button className='btn btn-ghost border border-orange-600 text-white/90 hover:bg-orange-600 z-40'>
          Shop Now
        </button>
      </div>
    </div>
  )
}
