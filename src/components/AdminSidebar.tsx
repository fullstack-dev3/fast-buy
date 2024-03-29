import React from 'react';
import { useSelector } from 'react-redux';
import { RxDashboard } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { GiLoincloth } from 'react-icons/gi';
import { MdOutlinePendingActions } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RootState } from '@/Store/store';

type adminData = {
  pendingOrders: number,
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const data = useSelector((state: RootState) => state.AdminData.adminData) as adminData | null;

  return (
    <div className='w-60 hidden md:block bg-white h-screen dark:text-black'>
      <div className='w-full text-center py-2 px-2 h-20'>
        <h1 className='flex text-2xl font-semibold items-center justify-center'>
          <RxDashboard className='mx-2' /> Dashboard
        </h1>
      </div>
      <div className='w-full'>
        <ul className='flex flex-col items-start justify-center'>
          <li
            className={
              pathname == '/admin'
                ? 'mb-2 py-3 pl-3 w-full bg-purple-200 text-blue-600'
                : 'mb-2 py-3 pl-3 w-full hover:bg-purple-200 hover:text-blue-600'
            }
          >
            <Link href={'/admin'} className='flex items-center'>
              <AiFillHome className='mx-2' /> Home
            </Link>
          </li>
          <li
            className={
              pathname == '/admin/categories'
                ? 'mb-2 py-3 pl-3 w-full bg-purple-200 text-blue-600'
                : 'mb-2 py-3 pl-3 w-full hover:bg-purple-200 hover:text-blue-600'
            }
          >
            <Link href={'/admin/categories'} className='flex items-center'>
              <BiCategory className='mx-2' /> Categories
            </Link>
          </li>
          <li
            className={
              pathname == '/admin/products'
                ? 'mb-2 py-3 pl-3 w-full bg-purple-200 text-blue-600'
                : 'mb-2 py-3 pl-3 w-full hover:bg-purple-200 hover:text-blue-600'
            }
          >
            <Link href={'/admin/products'} className='flex items-center'>
              <GiLoincloth className='mx-2' /> Products
            </Link>
          </li>
          <li
            className={
              pathname == '/admin/orders'
                ? 'mb-2 py-3 pl-3 w-full bg-purple-200 text-blue-600'
                : 'mb-2 py-3 pl-3 w-full hover:bg-purple-200 hover:text-blue-600'
            }
          >
            <Link href={'/admin/orders'} className='flex items-center'>
              <MdOutlinePendingActions className='mx-2' /> Orders
              {data && data.pendingOrders > 0 &&
                <span className="inline-flex items-center justify-center w-6 h-6 ml-6 text-sm font-semibold text-blue-800 bg-blue-200 rounded-full">
                  {data.pendingOrders}
                </span>
              }
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
