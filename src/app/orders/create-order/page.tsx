"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  get_all_cart_Items,
  update_cart_item,
  delete_cart_item
} from '@/Services/Common/cart';
import { create_a_new_order } from '@/Services/Common/order';
import { setCartData } from '@/utils/CartDataSlice';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Loading from '@/app/loading';

interface userData {
  name: String,
  email: String,
  role: String,
  _id: String,
}

type cartData = {
  product: {
    name: string,
    price: string,
    image: string,
    quantity: number,
    _id: string,
  },
  user: {
    _id: string,
  },
  quantity: number,
  _id: string,
}

type updateCartData = {
  user: string,
  product: string,
  quantity: number,
}

type Inputs = {
  fullName: string,
  address: string,
  city: string,
}

export default function Order() {
  const dispatch = useDispatch();
  const Router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [userID, setUserID] = useState<String>('');
  const [cartItems, setCartItems] = useState<cartData[]>([]);

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');

    if (!Cookies.get('token') || user === null) {
      Router.push('/');
    }

    setUserID(user?._id || '');
  }, [Router]);

  const { data } = useSWR(userID != '' ? '/getCartItems' : null, () => get_all_cart_Items(userID));

  useEffect(() => {
    if (data?.success === true) {
      setLoading(false);
      setCartItems(data.data);
    }
  }, [data]);

  const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setOrdering(true);
  
    const finalData = {
      user: userID,
      orderItems: cartItems?.map(item => {
        return {
          product: item.product._id,
          qty: item.quantity
        }
      }),
      shippingAddress: {
        fullName: data.fullName,
        address: data.address,
        city: data.city
      },
      paymentMethod: 'PayPal',
      itemsPrice: totalPrice,
      shippingPrice: parseFloat((totalPrice * 0.01).toFixed(2)),
      taxPrice: 3,
      totalPrice: parseFloat((totalPrice + totalPrice * 0.01 + 3).toFixed(2)),
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
      deliveredAt: new Date(),
    }
  
    const res =  await create_a_new_order(finalData);
    if (res?.success){
      toast.success(res?.message);
      
      setTimeout(() => {
        Router.push('/');
      } , 1000);
      setOrdering(false);
    }else{
      toast.error(res?.message);
      setOrdering(false);
    }
  }

  const updateCart = async (data: updateCartData) => {
    const res = await update_cart_item(data);
    if (res?.success === true) {
      setCartItems(res.data);

      let counts = 0;
      res.data.map((item: cartData) => counts += item.quantity);

      let total = 0;
      res.data.map((item: cartData) =>
        total += parseFloat(item.product.price) * item.quantity
      );

      dispatch(setCartData({ counts, total }));
    }
  }

  const handleDecrement = (item: cartData) => {
    if (item.quantity > 1) {
      const data = {
        user: userID.toString(),
        product: item.product._id,
        quantity: item.quantity - 1
      };

      updateCart(data);
    }
  }

  const handleIncrement = (item: cartData) => {
    if (item.quantity < item.product.quantity) {
      const data = {
        user: userID.toString(),
        product: item.product._id,
        quantity: item.quantity + 1
      };

      updateCart(data);
    }
  }

  const deleteItem = async (id: string) => {
    const res = await delete_cart_item(id);
    if (res?.success === true) {
      setCartItems(res.data);

      let counts = 0;
      res.data.map((item: cartData) => counts += item.quantity);

      let total = 0;
      res.data.map((item: cartData) =>
        total += parseFloat(item.product.price) * item.quantity
      );

      dispatch(setCartData({ counts, total }));
    }
  }

  const calcTotalPrice = (myCart: cartData[]) => {
    const totalPrice = myCart?.reduce((acc, item) => {
      return acc + (item.quantity * Number(item.product.price));
    }, 0);

    return totalPrice;
  }

  const totalPrice = calcTotalPrice(cartItems as cartData[]);

  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className="flex border-b-2 border-b-orange-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart-check" viewBox="0 0 16 16">
            <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          <p className="text-2xl ml-2">Checkout</p>
        </div>

        {ordering ? (
          <div className='w-full  flex-col h-96 flex items-center justify-center '>
            <TailSpin
              height="50"
              width="50"
              color="orange"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
            />
            <p className='text-sm mt-2 font-semibold text-orange-500'>
              Creating Your Order Hold Tight ....
            </p>
          </div>
        ) : (
          isLoading
          ? <Loading />
          : cartItems.length > 0 ? (
            <div className='w-full h-full flex-col md:flex-row flex items-start justify-center'>
              <div className='md:w-2/3 w-full px-2'>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">Image</th>
                        <th scope="col" className="px-6 py-3 text-center">Product</th>
                        <th scope="col" className="px-6 py-3 text-center">Price</th>
                        <th scope="col" className="px-2 py-3 text-center">Qty</th>
                        <th scope="col" className="px-2 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item: cartData) => (
                      <tr
                        key={item._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="w-32 px-6 py-4 align-center">
                          <Image
                            src={item.product.image}
                            alt='no image found'
                            width={80}
                            height={120}
                            className='rounded'
                          />
                        </td>
                        <td className="px-6 py-4 text-lg text-gray-900 dark:text-white">
                          {item.product.name}
                        </td>
                        <td className="px-6 py-4 text-lg text-center text-gray-900 dark:text-white">
                          ${item.product.price}
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              onClick={() => handleDecrement(item)}
                            >
                              <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            </button>
                            <p className='mx-2 text-lg'>{item.quantity}</p>
                            <button
                              type="button"
                              className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              onClick={() => handleIncrement(item)}
                            >
                              <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-4 justify-center">
                          <AiFillDelete
                            className="text-red-500 text-2xl cursor-pointer"
                            onClick={() => deleteItem(item._id)}
                            style={{ margin: '0 auto' }}
                          />
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  <div className='flex mb-4 px-4 items-end justify-center flex-col'>
                    <div className='w-full py-2 my-2 flex justify-end '>
                      <h1 className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'>
                        Original Price
                        <span className='text-xl font-extrabold'>$ {totalPrice}</span>
                      </h1>
                      <h1 className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'>
                        Shipping Price
                        <span className='text-xl font-extrabold'>
                          $ {(totalPrice * 0.01).toFixed(2)}
                        </span>
                      </h1>
                      <h1 className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'>
                        Tax Price <span className='text-xl font-extrabold'>$ 3</span>
                      </h1>
                    </div>
                    <div className='w-full py-2 my-2 flex justify-end '>
                      <h1 className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'>
                        Total Order Price
                        <span className='text-xl font-extrabold'>
                          $ {(totalPrice + totalPrice * 0.01 + 3).toFixed(2)}
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/3 px-2 w-full max-w-lg py-2 flex-col">
                <div className="form-control w-full mb-2">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label >
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type here"
                    {...register("fullName", { required: true })}
                  />
                  {errors.fullName &&
                    <span className='text-red-500 text-xs mt-2'>
                      This field is required
                    </span>
                  }
                </div >
                <div className="form-control w-full mb-2">
                  <label className="label">
                    <span className="label-text">Your Address</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type here"
                    {...register("address", { required: true })}
                  />
                  {errors.address &&
                    <span className='text-red-500 text-xs mt-2'>
                      This field is required
                    </span>
                  }
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="City"
                    {...register("city", { required: true })}
                  />
                  {errors.city &&
                    <span className='text-red-500 text-xs mt-2'>
                      This field is required
                    </span>
                  }
                </div>
                <button className='btn btn-block mt-3'>Order !</button>
              </form >
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center flex-col'>
              <p className='my-4 mx-2 text-lg font-semibold '>No Item Available in Cart</p>
              <Link href='/shop' className='btn text-white'>Shop Now</Link>
            </div>
          )
        )}
        <ToastContainer />
      </div>
      <Footer />
    </>
  )
}
