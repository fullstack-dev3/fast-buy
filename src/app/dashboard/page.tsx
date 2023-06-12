"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import StatsTiles from '@/components/StatsTiles';
import GetTilesData from '@/app/tilesDatas/Tiles';

interface userData {
  _id: string,
  name: string,
  email: string, 
  role: string, 
}

export default function Dashboard() {
  const Router = useRouter();

  const data = GetTilesData();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin') {
      Router.push('/');
    }
  });

  return (
    <div className='w-full min-h-screen flex bg-base-200'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div className='w-full grid grid-cols-2 md:grid-cols-3 px-4 py-2'>
          {data?.map((tile, index) => {
            return (
              <StatsTiles
                key={index}
                Icon={tile.icon}
                color={tile.color}
                title={tile.title}
                count={tile.count}
              />
            )
          })}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
