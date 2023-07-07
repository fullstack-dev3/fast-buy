"use client"

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { FcShop } from 'react-icons/fc';
import Image from 'next/image';
import { get_all_categories } from '@/Services/Common/category';
import { get_all_products } from '@/Services/Common/product';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Loading from '@/app/loading';

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  fileName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type ProductData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  featured: Boolean;
  category: {
    _id: string;
    name: string;
  };
};

export default function Shop() {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<ProductData[] | null>(null);

  const { data, isLoading } = useSWR(
    '/gettingAllProducts', get_all_products
  );
  const { data: categories } = useSWR(
    '/gettingAllCategories', get_all_categories
  );

  useEffect(() => {
    setProducts(data);
  }, [data]);

  if (categories && categories.length > 0) {
    categories.sort(function(a: CategoryData, b: CategoryData) {
      return a.name > b.name ? 1 : -1;
    });
  }

  const filterByCategory = (catId: string) => {
    setCategory(catId);
    if (catId == '') {
      setProducts(data);
    } else {
      setProducts(data.filter((item: ProductData) => item.category._id == catId));
    }
  }

  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className='w-full p-2 flex flex-wrap'>
          {categories && (
            <div
              className={
                category == ''
                ? "flex text-black cursor-pointer mx-2 mb-2 bg-gray-200 shadow-md"
                : "flex text-black cursor-pointer mx-2 mb-2 shadow-md"
              }
              onClick={() => filterByCategory('')}
            >
              <FcShop className='text-5xl' />
              <h3 className='font-medium pt-3 px-6'>All</h3>
            </div>
          )}
          {categories?.map((item: CategoryData) => {
            return (
              <div
                key={item._id}
                className={
                  category == item._id
                  ? "flex text-black cursor-pointer mx-2 mb-2 bg-gray-200 shadow-md"
                  : "flex text-black cursor-pointer mx-2 mb-2 shadow-md"
                }
                onClick={() => filterByCategory(item._id)}
              >
                <div className="w-12">
                  <div className='w-full rounded relative h-12'>
                    <Image src={item.image} alt='no Image' className='rounded' fill />
                  </div>
                </div>
                <h3 className='font-medium pt-3 px-2'>{item.name}</h3>
              </div>
            )
          })}
        </div>
        <div className='w-full flex flex-col'>
          {
            isLoading
            ? <Loading />
            : products && (
              <div className='w-full px-1 h-full py-2 flex items-center justify-center flex-wrap'>
                {products.map((item: ProductData) => {
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
            )
          }
        </div>
      </div>
      <Footer />
    </>
  )
}
