import React from 'react';
import { RxDashboard } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { GiLoincloth } from 'react-icons/gi';
import { IoIosAddCircle } from 'react-icons/io';
import { MdOutlinePendingActions } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <div className='w-60 hidden md:block bg-white h-full dark:text-black'>
      <div className='w-full text-center py-2 px-2 h-20'>
        <h1 className='flex text-2xl font-semibold items-center justify-center'>
          <RxDashboard className='mx-2' /> Dashboard
        </h1>
      </div>
      <div className='w-full '>
        <ul className='flex px-4 flex-col items-start justify-center'>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/dashboard'} className='flex items-center justify-center'>
              <AiFillHome className='mx-2' /> Home
            </Link>
          </li>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/categories'} className='flex items-center justify-center'>
              <BiCategory className='mx-2' /> Categories
            </Link>
          </li>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/categories/add-category'} className='flex items-center justify-center'>
              <IoIosAddCircle className='mx-2' /> Add Category
            </Link>
          </li>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/products'} className='flex items-center justify-center'>
              <GiLoincloth className='mx-2' /> Products
            </Link>
          </li>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/products/add-product'} className='flex items-center justify-center'>
              <IoIosAddCircle className='mx-2' /> Add Product
            </Link>
          </li>
          <li className='py-3 px-1 mb-3'>
            <Link href={'/orders'} className='flex items-center justify-center'>
              <MdOutlinePendingActions className='mx-2' /> Orders
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
