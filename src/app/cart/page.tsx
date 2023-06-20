"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  get_all_cart_Items,
  update_cart_item,
  delete_cart_item
} from '@/Services/Common/cart';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Loading from '../loading';

interface userData {
  name: String,
  email: String,
  role: String,
  _id: String,
}

type Data =  {
  product: {
    name: string,
    price: string,
    image: string,
    quantity: number,
    _id: string,
  },
  quantity: number,
  _id: string,
}

export default function Cart() {
  const Router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState<String>('');
  const [cartData, setCartData] = useState<Data[]>([]);

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
      setIsLoading(false);
      setCartData(data.data);
    } else {
      toast.error(data?.message);
    }
  }, [data])

  const handleDecrement = async (item: Data) => {
    if (item.quantity > 1) {
      const data = {
        user: userID,
        product: item.product._id,
        quantity: item.quantity - 1
      };

      const res = await update_cart_item(data);
      if (res?.success === true) {
        setCartData(res.data);
      }
    }
  }

  const handleIncrement = async (item: Data) => {
    if (item.quantity < item.product.quantity) {
      const data = {
        user: userID,
        product: item.product._id,
        quantity: item.quantity + 1
      };

      const res = await update_cart_item(data);
      if (res?.success === true) {
        setCartData(res.data);
      }
    }
  }

  const deleteItem = async (id: string) => {
    const res = await delete_cart_item(id);
    if (res?.success === true) {
      setCartData(res.data);
    }
  }

  const calcTotalPrice = (myCart: Data[]) => {
    const totalPrice = myCart?.reduce((acc, item) => {
      return acc + (item.quantity * Number(item.product.price));
    }, 0);

    return totalPrice;
  }

  const totalPrice = calcTotalPrice(cartData as Data[]);

  return (
    <>
      <Navbar />
      <div
        className='w-full mt-[64px] px-5 py-5 bg-white dark:text-black'
        style={{ minHeight: 'calc(100vh - 204px)' }}
      >
        <div className="flex border-b-2 border-b-orange-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" className="bi bi-cart" viewBox="0 0 16 16"> <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/> </svg>
          <p className="text-2xl ml-2">My Cart</p>
        </div>
        {isLoading
          ? <Loading />
          : cartData.length > 0
            ? (
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
                    {cartData.map((item: Data) => (
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
                  <h1
                    className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'
                  >
                    Total Price <span className='text-xl font-extrabold'>$ {totalPrice}</span>
                  </h1>
                  <button className='btn btn-success'>Checkout</button>
                </div>
              </div>
            ) : (
              <h2 className="text-4xl text-center font-extrabold dark:text-white">
                Cart is Empty
              </h2>
            )
        }
        <ToastContainer />
      </div>
      <Footer />
    </>
  )
}
