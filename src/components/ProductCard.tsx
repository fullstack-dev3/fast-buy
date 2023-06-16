import React from 'react';
import {BsCartPlus , BsFillBookmarkCheckFill} from 'react-icons/bs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ProductData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: Number;
};

export default function ProductCard({ _id, name, description, image, price }: ProductData) {
  const router =  useRouter();

  return (
    <div
      className="card cursor-pointer card-compact m-3 w-80 bg-white shadow-xl relative text-black"
      onClick={() => router.push(`/products/product-detail/${_id}`)}
    >
      <div className='w-full rounded relative h-60'>
        <Image src={image} alt='no Image' className='rounded' fill/>
      </div>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <p className='font-semibold'>$ {price.toFixed(2)}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-circle btn-ghost ">
            <BsCartPlus className='text-2xl text-orange-600 font-semibold' />
          </button>
          <button className="btn btn-circle btn-ghost absolute top-0 right-0 ">
            <BsFillBookmarkCheckFill className='text-2xl text-orange-600 font-semibold' />
          </button>
        </div>
      </div>
    </div>
  )
}
