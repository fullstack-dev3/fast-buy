"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [Scrolled, setScrolled] = useState(false);
  const [userisLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    window.onscroll = () => {
      setScrolled(window.pageYOffset < 30 ? false : true);
      return () => window.onscroll = null;
    }
  }, [Scrolled]);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUserIsLoggedIn(true);
    }
  }, [setUserIsLoggedIn]);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    setUserIsLoggedIn(false);
  }

  return (
    <>
      <nav className={`navbar bg-purple-500 fixed justify-between text-white top-0 left-0 z-50`}>
        <div className="flex-shrink-0 ml-2 mr-6">
          <Image
            src={'/logo.png'}
            alt='no Image'
            height={40}
            width={200}
          />
        </div>
        <div className="block sm:hidden">
          <button
            className="flex items-center px-3 py-2 border rounded text-purple-200 border-purple-400 hover:text-white hover:border-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>
        <div className="w-full hidden sm:block sm:flex-grow sm:flex sm:items-center sm:w-auto">
          <div className="text-sm sm:flex-grow">
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
              Home
            </Link>
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
              Shop
            </Link>
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
              About
            </Link>
          </div>
          <div>
          {userisLoggedIn
            ?
              <button onClick={handleLogout} className='btn mx-2'>
                logout
              </button>
            :
              <>
                <button
                  className='btn btn-primary btn-sm mx-2'
                  onClick={() => router.push('/auth/register')}
                >
                  Register
                </button>
                <button
                  className='btn btn-sm mx-2'
                  onClick={() => router.push('/auth/login')}
                >
                  Login
                </button>
              </>
            }
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="w-full fixed text-sm bg-purple-500 px-2 py-3 top-0 left-0 z-50 sm:hidden"
          style={{ marginTop: '50px' }}
        >
          <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
            Home
          </Link>
          <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
            Shop
          </Link>
          <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
            About
          </Link>
          <Link href="/auth/register" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
            Register
          </Link>
          <Link href="/auth/login" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
            Login
          </Link>
        </div>
      )}
    </>
  )
}
