"use client"

import React from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import StatsTiles from '@/components/StatsTiles';
import data from '@/Tiles';

export default function Dashboard() {
  return (
    <div className='w-full min-h-screen flex bg-base-200'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div className='w-full grid grid-cols-2 md:grid-cols-3 px-4 py-2'>
          {data?.map((tile, index) => {
            return (
              <StatsTiles key={index}
                Icon={tile.icon}
                color={tile.color}
                title={tile.title}
                count={tile.count}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
