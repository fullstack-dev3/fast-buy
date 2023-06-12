import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CategoryData = {
  name: string;
  description: string;
  image: string;
  _id: string;
};

export default function CategoryCard({ description, image, name, _id }: CategoryData) {
  const router = useRouter();

  return (
    <div className="card card-compact m-3 w-80 bg-gray-50 shadow-xl relative">
      <div className='w-full rounded relative h-60'>
        <Image src={image} alt='no Image' className='rounded' fill />
      </div>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <button
          className='btn btn-wide'
          onClick={() => router.push(`/categories/category-product/${_id}`)}
        >
          View Products
        </button>
      </div>
    </div>
  )
}
