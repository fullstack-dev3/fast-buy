"use client"

import React from 'react';
import { MdFavorite } from 'react-icons/md';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import FavouriteProductTable from '@/components/FavoriteProductTable';

export default function Favorites() {
  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className="flex border-b-2 border-b-orange-600 mb-3">
          <MdFavorite className='text-3xl text-orange-600 font-semibold' />
          <p className="text-2xl ml-2">Favorite Products</p>
        </div>
        <FavouriteProductTable />
      </div>
      <Footer />
    </>
  )
}
