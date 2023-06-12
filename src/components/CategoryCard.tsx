import React from 'react';
import Image from 'next/image';

type CategoryData = {
  name: string;
  description: string;
  image: string;
};

export default function CategoryCard({ name, description, image }: CategoryData) {
  return (
    <div className="card card-compact m-3 w-80 bg-gray-50 shadow-xl relative">
      <div className='w-full rounded relative h-60'>
        <Image src={image} alt='no Image' className='rounded' fill />
      </div>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <button className='btn btn-wide' >View Products</button>
      </div>
    </div>
  )
}
