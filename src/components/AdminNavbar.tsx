"use client"

import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { GiLoincloth } from 'react-icons/gi';
import { MdOutlinePendingActions } from 'react-icons/md';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router =  useRouter();
  const pathname = usePathname();

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
            className="menu menu-compact dropdown-content mt-1 text-black bg-gray-50 w-40"
          >
            <li
              className={
                pathname == '/admin'
                  ? 'mb-1 py-1 w-full bg-purple-200 text-blue-600'
                  : 'mb-1 py-1 w-full hover:bg-purple-200 hover:text-blue-600'
              }
            >
              <Link href={'/admin'} className='flex items-center'>
                <AiFillHome /> Home
              </Link>
            </li>
            <li
              className={
                pathname == '/admin/categories'
                  ? 'mb-1 py-1 w-full bg-purple-200 text-blue-600'
                  : 'mb-1 py-1 w-full hover:bg-purple-200 hover:text-blue-600'
              }
            >
              <Link href={'/admin/categories'} className='flex items-center'>
                <BiCategory /> Categories
              </Link>
            </li>
            <li
              className={
                pathname == '/admin/products'
                  ? 'mb-1 py-1 w-full bg-purple-200 text-blue-600'
                  : 'mb-1 py-1 w-full hover:bg-purple-200 hover:text-blue-600'
              }
            >
              <Link href={'/admin/products'} className='flex items-center'>
                <GiLoincloth /> Products
              </Link>
            </li>
            <li
              className={
                pathname == '/admin/orders'
                  ? 'mb-1 py-1 w-full bg-purple-200 text-blue-600'
                  : 'mb-1 py-1 w-full hover:bg-purple-200 hover:text-blue-600'
              }
            >
              <Link href={'/admin/orders'} className='flex items-center'>
                <MdOutlinePendingActions /> Orders
              </Link>
            </li>
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
