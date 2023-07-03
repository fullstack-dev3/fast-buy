"use client"

import React from 'react';
import useSWR from 'swr';
import { get_all_categories } from '@/Services/Common/category';
import Loading from '@/app/loading';
import CategoryCard from './CategoryCard';

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
};

export default function TopCategories() {
  const { data, isLoading } = useSWR('/gettingAllCategories', get_all_categories);

  const filteredCategories = data?.slice(0, 3);

  return (
    <div className='w-full border-2 flex items-center flex-col justify-start bg-gray-50'>
      {
        isLoading
        ? <Loading />
        : filteredCategories.length > 0 && (
          <>
            <div className='flex items-center justify-center px-2 py-2 mb-2'>
              <h1 className='py-2 px-4 border-x-2 border-x-orange-500 text-black font-semibold text-2xl '>
                Top Categories
              </h1>
            </div>
            <div className='md:w-4/5 w-full px-1 h-full py-2 md:px-4 flex items-center justify-center flex-wrap'>
              {filteredCategories?.map((item: CategoryData) => {
                return (
                  <CategoryCard
                    key={item?._id}
                    _id={item?._id}
                    name={item?.name}
                    description={item?.description}
                    image={item?.image}
                  />
                )}
              )}
            </div>
          </>
        )
      }
    </div>
  )
}
