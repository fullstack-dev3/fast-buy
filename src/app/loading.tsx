"use client"

import React from 'react';
import { TailSpin } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className='w-full  flex-col h-96 flex items-center justify-center '>
      <TailSpin
        ariaLabel="tail-spin-loading"
        color="orange"
        height="50"
        radius="1"
        visible={true}
        width="50"
      />
      <p className='text-sm mt-2 font-semibold text-orange-500'>
        Loading Hold Tight ....
      </p>
    </div>
  )
}
