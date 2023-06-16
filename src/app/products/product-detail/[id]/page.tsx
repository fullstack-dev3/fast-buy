'use client'

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import { BiCartAdd } from 'react-icons/bi';
import { RiBookMarkFill } from 'react-icons/ri';
import { FaProductHunt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/loading';
import { get_product_by_id } from '@/Services/Common/product';

interface pageParam {
  id: string
}

type ProductData = {
  _id: string,
  name: string,
  description: string,
  image: string,
  slug: string,
  price: Number,
  quantity: Number,
  featured: Boolean,
  category: {
    name: string,
    _id: string,
  },
  createdAt: string,
  updatedAt: string,
};

export default function Page({ params }: { params: pageParam }) {
  const [prodData, setprodData] = useState<ProductData | undefined>(undefined);

  const { data, isLoading } = useSWR('/gettingProductbyID', () => get_product_by_id(params.id));

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setprodData(data?.data);
  }, [data]);

  return (
    <div className='w-full h-full dark:text-black lg:h-screen bg-gray-50 py-4 px-2'>
      <div className="text-sm breadcrumbs  border-b-2 py-2 px-2 border-b-orange-600">
        <ul>
          <li>
            <Link href={"/"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Home
            </Link>
          </li>
          <li>
            <Link href={`/categories/category-product/${prodData?.category?._id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              {prodData?.category?.name}
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {prodData?.name}
          </li>
        </ul>
      </div>
      <div className='w-full h-full lg:h-4/5 py-4 px-4 flex items-center justify-center'>
        {isLoading
          ?
            <div className='w-4/5 bg-gray-100 rounded-xl h-4/5 flex items-center justify-center shadow-2xl '>
              <Loading />
            </div>
          :
            <div className='w-full h-full lg:w-4/5 lg:h-4/5 bg-gray-100 rounded-xl flex flex-col lg:flex-row items-center justify-center shadow-2xl'>
              <div className='w-full h-60 lg:w-4/12 lg:h-full rounded-xl z-10 relative'>
                {prodData?.image &&
                  <Image src={prodData.image} alt='no image' fill className='rounded-xl' />
                }
              </div>
              <div className='w-full h-full lg:w-8/12 rounded flex flex-col px-3 py-2 lg:px-5'>
                <div className='w-full md:h-20 flex flex-col lg:flex-row md:justify-between py-2 items-center'>
                  <h1 className='text-3xl font-semibold text-black'>{prodData?.name}</h1>
                  {
                    prodData?.featured &&
                    <p className='px-3 py-2 lg:flex bg-orange-600 hidden font-semibold tracking-widest rounded text-white items-center justify-center'>
                      <FaProductHunt className='mx-2' />
                      Featured Product
                    </p>
                  }
                </div>
                <p className='w-full lg:h-40 py-2'>{prodData?.description}</p>
                <h1 className='text-3xl font-semibold text-black py-2'>
                  $ {`${prodData?.price.toFixed(2)}`}
                </h1>
                <div className='w-full py-2 lg:flex-row flex-col flex'>
                  <button
                    className='btn m-2 lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'
                  >
                    <BiCartAdd className='text-3xl mx-2' /> Add to Cart
                  </button>
                  <button
                    className='btn m-2 lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'
                  >
                    <RiBookMarkFill className='text-3xl mx-2' /> Bookmark
                  </button>
                </div>
              </div>
            </div>
        }
      </div>
      <ToastContainer />
    </div>
  )
}
