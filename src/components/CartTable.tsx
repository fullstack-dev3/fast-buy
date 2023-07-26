"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AiFillDelete } from 'react-icons/ai';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  get_all_cart_Items,
  update_cart_item,
  delete_cart_item
} from '@/Services/Common/cart';
import { setCartData } from '@/utils/CartDataSlice';
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
  quantity: number,
  _id: string,
}

type updateCartData = {
  user: string,
  product: string,
  quantity: number,
}

export default function CartTable() {
  const dispatch = useDispatch();
  const Router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<cartData[]>([]);
  const [userID, setUserID] = useState<String>('');

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
      setCartItems(data.data);
    } else {
      toast.error(data?.message);
    }
  }, [data]);

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
      {isLoading
        ? <Loading />
        : cartItems.length > 0 ? (
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
              <h1
                className='py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col'
              >
                Total Price <span className='text-xl font-extrabold'>$ {totalPrice}</span>
              </h1>
              <Link href='/orders/create-order' className='btn btn-success text-white'>
                Checkout
              </Link>
            </div>
          </div>
        ) : (
          <h2 className="text-4xl text-center font-extrabold dark:text-white">
            Cart is Empty
          </h2>
        )
      }
      <ToastContainer />
    </>
  )
}
