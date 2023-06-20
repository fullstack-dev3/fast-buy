"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Link from 'next/link';
import Loading from '@/app/loading';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { get_category_by_id } from '@/Services/Common/category';
import { get_product_by_category } from '@/Services/Common/product';

interface pageParam {
  id: string
}

type ProductData = {
  name: string,
  description: string,
  image: string,
  price: Number,
  featured: Boolean,
  category: {
    name: string,
    _id: string,
  },
  _id: string
};

export default function Page({ params }: { params: pageParam }) {
  const [catName, setCatName] = useState('');
  const [product, setProdData] = useState<ProductData[] | []>([]);

  const { data: catData } = useSWR('/gettingCategoryByID',
    () => get_category_by_id(params.id)
  );

  const { data: prodData, isLoading } = useSWR(
    '/gettingProductByCategoryID',
    () => get_product_by_category(params.id)
  );

  useEffect(() => {
    if (catData) {
      setCatName(catData?.data.name);
    }
  }, [catData]);

  useEffect(() => {
    setProdData(prodData?.data);
  }, [prodData]);

  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
          <p className="text-2xl ml-2">Category: {catName}</p>
        </div>
        <div className='w-full h-full flex items-start justify-center flex-wrap overflow-auto'>
          {isLoading
            ? <Loading />
            : (
              product?.map((item: ProductData) => (
                <ProductCard
                  key={item?._id}
                  _id={item?._id}
                  name = {item?.name}
                  description={item?.description}
                  price = {item?.price}
                  image = {item?.image}
                />
              ))
            )
          }
          {isLoading === false &&
            (product === undefined || product === null || product.length < 1) &&
              <p className='text-2xl my-4 text-center font-semibold text-red-400'>
                No Product Found in this Category
              </p>
          }
        </div>
      </div>
      <Footer />
    </>
  )
}
