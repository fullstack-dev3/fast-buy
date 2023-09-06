'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import { BiCartAdd } from 'react-icons/bi';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { FaProductHunt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/loading';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { get_product_by_id } from '@/Services/Common/product';
import { add_to_cart } from '@/Services/Common/cart';
import { add_to_favorite } from '@/Services/Common/favorite';
import { setCartData } from '@/utils/CartDataSlice';
import { setFavoriteData } from '@/utils/FavoriteDataSlice';
import { RootState } from '@/Store/store';

interface pageParam {
  id: string
}

type UserData = {
  _id: string,
  name: string,
  email: string,
};

type ProductData = {
  _id: string,
  name: string,
  description: string,
  image: string,
  slug: string,
  price: number,
  quantity: number,
  featured: Boolean,
  category: {
    name: string,
    _id: string,
  },
  createdAt: string,
  updatedAt: string,
};

type UserCartData = {
  counts: number,
  total: number,
}

export default function Page({ params }: { params: pageParam }) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.User.userData) as UserData | null;
  const cart = useSelector((state: RootState) => state.Cart.cartData) as UserCartData | null;
  const favorites = useSelector((state: RootState) => state.Favorite.favoriteData) as string[];

  const [prodData, setprodData] = useState<ProductData | undefined>(undefined);

  const { data, isLoading } = useSWR('/gettingProductbyID', () => get_product_by_id(params.id));

  useEffect(() => {
    if (data && data.success) {
      setprodData(data.data);
    }
  }, [data]);

  let quantity = 'Quantity : ';
  if (prodData) {
    if (prodData.quantity < 10) {
      quantity += prodData.quantity;
    } else {
      if (prodData.quantity < 100) {
        quantity += '10+';
      } else if (prodData.quantity < 500) {
        quantity += '100+';
      } else {
        quantity += '500+';
      }
    }
  }

  const AddToCart = async () => {
    const data = {
      user: user?._id,
      product: params.id,
      quantity: 1
    };

    const res = await add_to_cart(data);
    if (res?.success) {
      const cartData = {
        counts: cart ? cart.counts + 1 : 1,
        total: cart ? cart.total + (prodData ? prodData.price : 0) : prodData?.price
      }

      dispatch(setCartData(cartData));
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  }

  const AddToFavorite = async () => {
    const finalData = {
      user: user?._id,
      product: params.id
    };

    const res = await add_to_favorite(finalData);
    if (res?.success) {
      let data = favorites.concat([params.id]);

      dispatch(setFavoriteData(data));
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  }

  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className="text-sm breadcrumbs  border-b-2 py-2 px-2 border-b-orange-600">
          {prodData &&
            <ul>
              <li>
                <Link href={`/categories/category-product/${prodData?.category?._id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                  {prodData?.category?.name}
                </Link>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                {prodData?.name}
              </li>
            </ul>
          }
        </div>
        <div className='w-full h-full lg:h-4/5 py-4 px-4 flex items-center justify-center'>
          {isLoading
            ?
              <div className='w-4/5 bg-gray-100 rounded-xl h-4/5 flex items-center justify-center shadow-2xl '>
                <Loading />
              </div>
            :
              prodData &&
              <div className='w-full h-full lg:w-4/5 lg:h-4/5 bg-gray-100 rounded-xl flex flex-col lg:flex-row justify-center shadow-2xl'>
                <div className='w-full h-60 lg:w-4/12 rounded-xl my-6 mx-4 z-10 relative'>
                  {prodData?.image && (
                    <>
                      <Image src={prodData.image} alt='no image' fill className='rounded-xl' />
                      {favorites.includes(prodData?._id) && (
                        <MdFavorite className='text-2xl text-orange-600 font-semibold absolute top-2 right-2' />
                      )}
                    </>
                  )}
                </div>
                <div className='w-full h-full lg:w-8/12 rounded flex flex-col px-3 py-2 lg:px-5'>
                  <div className='w-full md:h-20 flex flex-col lg:flex-row md:justify-between py-2 items-center'>
                    <h1 className='text-3xl font-semibold text-black'>{prodData?.name}</h1>
                    {
                      prodData?.featured &&
                      <p className='px-3 py-2 lg:flex bg-orange-600 hidden font-semibold tracking-widest rounded text-white items-center justify-center'>
                        <FaProductHunt className='mx-2' />
                        Featured Product
                      </p>
                    }
                  </div>
                  <p className='w-full py-2'>{prodData?.description}</p>
                  <h1 className='text-3xl font-semibold text-black py-2'>
                    $ {`${prodData?.price.toFixed(2)}`}
                  </h1>
                  <p className='w-full py-2'>{quantity}</p>
                  {user && (
                    <div className='w-full py-2 lg:flex-row flex-col flex'>
                      <button
                        className='btn m-2 lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'
                        onClick={AddToCart}
                      >
                        <BiCartAdd className='text-3xl mx-2' /> Add to Cart
                      </button>
                      {prodData && !favorites.includes(prodData?._id) && (
                        <button
                          className='btn m-2 lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'
                          onClick={AddToFavorite}
                        >
                          <MdFavoriteBorder className='text-3xl mx-2' /> Add to Favorite
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
          }
          {isLoading === false && (prodData === undefined || prodData === null) &&
            <p className='text-2xl my-4 text-center font-semibold text-red-400'>
              No Product Found
            </p>
          }
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  )
}
