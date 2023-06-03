"use client"

import React from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

export default function Dashboard() {
  return (
    <div className='w-full h-screen flex  bg-base-200'>
      <AdminSidebar />
      <div className='w-full h-full bg-red-500'>
        <AdminNavbar />
      </div>
    </div>
  )
}
