import React from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import {BsCartPlus , BsFillBookmarkCheckFill} from 'react-icons/bs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { add_to_cart } from '@/Services/Common/cart';
import { RootState } from '@/Store/store';

type UserData = {
  name: string;
  email: string;
  _id: string;
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

  const user = useSelector((state: RootState) => state.User.userData) as UserData | null;

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
