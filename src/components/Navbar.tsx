"use client"

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdFavorite } from 'react-icons/md';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import { useCarts } from '@/hooks/useCarts';
import { useFavorites } from '@/hooks/useFavorites';
import { RootState } from '@/Store/store';

type userCartData = {
  counts: number,
  total: number,
}

export const Cart = () => {
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.Cart.cartData) as userCartData | null;

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#007BFF"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="badge badge-sm indicator-item">
            {cart ? cart.counts : 0}
          </span>
        </div>
      </label>
      <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-gray-50 shadow">
        <div className="card-body">
          <span className="font-bold text-lg text-black">
            {cart ? cart.counts : 0} items
          </span>
          <span className="text-error">Total: $ {cart ? cart.total : 0}</span>
          <div className="card-actions">
            <button
              className="btn btn-primary btn-block"
              onClick={() => router.push(`/cart`)}
            >
              View cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
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
    if (localStorage.getItem('user') && Cookies.get('token')) {
      setUserIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  useUsers();
  useCarts();
  useFavorites();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    setUserIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
  }

  return (
    <>
      <nav className={`navbar bg-purple-500 fixed justify-between text-white top-0 left-0 z-50`}>
        <Link href="/" className="flex-shrink-0 ml-2 mr-6">
          <Image
            src={'/logo.png'}
            alt='no Image'
            height={40}
            width={200}
          />
        </Link>
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
            <Link href="/shop" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
              Shop
            </Link>
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
              About
            </Link>
          </div>
          <div>
          {!isLoading && (
            userisLoggedIn ? (
              <div className='flex'>
                <div
                  className="flex items-center justify-center mr-1 cursor-pointer"
                  onClick={() => router.push("/favorites")}
                >
                  <MdFavorite className='text-3xl text-orange-600 font-semibold' />
                </div>
                <Cart />
                <button onClick={handleLogout} className='btn mx-2'>
                  Logout
                </button>
              </div>
            ) : (
              <div>
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
              </div>
            )
          )}
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="w-full fixed text-sm bg-purple-500 px-2 py-3 top-0 left-0 z-50 sm:hidden"
          style={{ marginTop: '50px' }}
        >
          <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white mr-4">
            Shop
          </Link>
          <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white">
            About
          </Link>
          {!isLoading && (
            userisLoggedIn ? (
              <>
                <Link
                  href="/favorites"
                  className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white"
                >
                  Favorite Products
                </Link>
                <Link
                  href="/cart"
                  className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white"
                >
                  View Cart
                </Link>
                <a
                  className="cursor-pointer block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white"
                >
                  Register
                </Link>
                <Link
                  href="/auth/login"
                  className="block mt-4 sm:inline-block sm:mt-0 text-purple-200 hover:text-white"
                >
                  Login
                </Link>
              </>
            )
          )}
        </div>
      )}
    </>
  )
}
