"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Link from 'next/link';
import Loading from '@/app/loading';
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
    <div className='w-full h-full bg-gray-50 py-4 px-2 dark:text-black'>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul>
          <li>
            <Link href={'/'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Home
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {catName}
          </li>
        </ul>
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
  )
}
