"use client"

import React from 'react';
import useSWR from 'swr';
import { get_all_products } from '@/Services/Common/product';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Loading from '@/app/loading';

type ProductData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  featured: Boolean;
};

export default function Shop() {
  const { data, isLoading } = useSWR('/gettingAllProducts', get_all_products);

  return (
    <>
      <Navbar />
      <div className='w-full  border-2 flex items-center flex-col justify-start'>
        {
          isLoading
          ? <Loading />
          : data.length > 0 && (
            <>
              <div className='flex items-center justify-center px-2 py-2 mb-2'>
                <h1 className='py-2 px-4 border-x-2 border-x-orange-500 font-semibold text-2xl '>
                  Top Products
                </h1>
              </div>
              <div className='w-full px-1 h-full py-2 flex items-center justify-center flex-wrap'>
                {data?.map((item: ProductData) => {
                    return (
                      <ProductCard
                        key={item?._id}
                        _id={item?._id}
                        name={item?.name}
                        description={item?.description}
                        image={item?.image}
                        price={item?.price}
                      />
                    )}
                  )
                }
              </div>
            </>
          )
        }
      </div>
      <Footer />
    </>
  )
}
