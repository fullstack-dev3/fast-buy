"use client"

import React from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router =  useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();

    router.push('/');
  }

  return (
    <div className="navbar dark:text-black bg-white">
      <div className="flex-1">
        <div className="dropdown md:hidden">
          <label tabIndex={0} className="btn btn-active btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow text-black bg-gray-50 rounded-box w-52"
          >
            <li><Link href={'/dashboard'}>Homepage</Link></li>
            <li><Link href={'/categories'}>Categories</Link></li>
            <li><Link href={'/categories/add-category'}>Add Category</Link></li>
            <li><Link href={'/products'}>Products</Link></li>
            <li><Link href={'/products/add-product'}>Add Product</Link></li>
            <li><Link href={'/orders'}>Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 relative rounded-full">
              <Image className='rounded-full' fill alt='none' src="/profile.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-50 rounded-box w-52"
          >
            <li>
              <Link href={'/'} className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li onClick={handleLogout}>
              <button> Logout </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
