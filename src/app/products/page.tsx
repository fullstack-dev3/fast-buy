"use client"

import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

export default function Products() {
  return (
    <div className='w-full min-h-screen flex bg-base-200'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div>
          
        </div>
      </div>
    </div>
  )
}
