import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {BsCartPlus , BsFillBookmarkCheckFill} from 'react-icons/bs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { add_to_cart } from '@/Services/Common/cart';

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
};

type ProductData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: Number;
};

export default function ProductCard({ _id, name, description, image, price }: ProductData) {
  const router =  useRouter();

  const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');

  const AddToCart = async () => {
    const data = {
      user: user?._id,
      product: _id,
      quantity: 1
    };

    const res = await add_to_cart(data);
    if (res?.success) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  }

  return (
    <div
      className="card cursor-pointer card-compact m-3 w-80 bg-white shadow-xl relative text-black"
    >
      <div
        className='w-full rounded relative h-60'
        onClick={() => router.push(`/products/product-detail/${_id}`)}
      >
        <Image src={image} alt='no Image' className='rounded' fill/>
      </div>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <p className='font-semibold'>$ {price.toFixed(2)}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-circle btn-ghost" onClick={AddToCart}>
            <BsCartPlus className='text-2xl text-orange-600 font-semibold' />
          </button>
          <button className="btn btn-circle btn-ghost absolute top-0 right-0 ">
            <BsFillBookmarkCheckFill className='text-2xl text-orange-600 font-semibold' />
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
