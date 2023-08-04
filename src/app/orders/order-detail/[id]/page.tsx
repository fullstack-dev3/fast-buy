"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { get_order_by_id } from '@/Services/Common/order';
import { update_order_status } from '@/Services/Admin/order';
import Loading from '@/app/loading';

interface OrderData {
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
  isPaid: boolean;
  itemsPrice: number;
  orderItems: {
    qty: number;
    product: {
      createdAt: string;
      category: string;
      description: string;
      featured: boolean;
      image: string;
      name: string;
      price: number;
      quantity: number;
      slug: string;
      updatedAt: string;
      _id: string;
    };
    _id: string;
  }[];
  paidAt: string;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    fullName: string;
  };
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    password: string;
    role: string;
    _id: string;
  };
  _id: string;
}

interface pageParam {
  id: string
}

interface userData {
  _id: String,
  name: String
  email: String,
  role: String,
}

export default function Page({ params }: { params: pageParam }) {
  const Router = useRouter();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');

    if (!Cookies.get('token') || !user) {
      Router.push('/');
    }
  }, [Router]);

  const [orderData, setOrderData] = useState<OrderData | undefined>(undefined);
  const { data, isLoading } = useSWR('/gettingOrderByID', () => get_order_by_id(params.id));

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setOrderData(data?.data);
  }, [data]);

  const deliverAction = async (id: string) => {
    const res =  await update_order_status(id);
    if(res?.success){
      setOrderData(res.data);
      toast.success(res?.message);
    }else{
      toast.error(res?.message);
    }
  }

  return (
    <div className='w-full p-4 min-h-screen bg-gray-50 flex flex-col dark:text-black'>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul>
          <li>
            <Link href={'/orders'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Orders
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Order Details
          </li>
        </ul>
      </div>
      <div className='w-full h-20 my-2 text-center'>
        <h1 className='text-2xl py-2 '>Order Details</h1>
      </div>
      {isLoading
        ? <Loading />
        :
          <div className='w-full h-5/6 dark:text-black overflow-y-auto'>
            <div className='w-full flex px-2 flex-wrap items-center justify-center'>
              <table className="w-9/12 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center">Product Name</th>
                    <th scope="col" className="px-6 py-3 text-center">Image</th>
                    <th scope="col" className="px-2 py-3 text-center">Qty</th>
                    <th scope="col" className="px-6 py-3 text-center">Price</th>
                    <th scope="col" className="px-6 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.orderItems.map((item) => {
                    return (
                      <tr
                        key={item._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-lg text-gray-900 dark:text-white">
                          {item.product.name}
                        </td>
                        <td className="w-28 px-6 py-4 align-center">
                          <Image
                            src={item.product.image}
                            alt='no image found'
                            width={60}
                            height={90}
                            className='rounded'
                          />
                        </td>
                        <td className="w-28 px-6 py-4 text-lg text-center text-gray-900 dark:text-white">
                          {item.qty}
                        </td>
                        <td className="w-32 px-6 py-4 text-lg text-center text-gray-900 dark:text-white">
                          ${item.product.price}
                        </td>
                        <td className="w-28 px-6 py-4 text-lg text-center text-gray-900 dark:text-white">
                          ${item.product.price * item.qty}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className='flex flex-wrap w-full items-center justify-center'>
              <div className=' border m-2 w-96  flex-col flex items-start justify-start py-2 px-4'>
                <h1 className='text-xl font-semibold '>Shipping Address</h1>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Full Name</p>
                  <p className='font-semibold'>{orderData?.shippingAddress?.fullName}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Address</p>
                  <p className='font-semibold'>{orderData?.shippingAddress?.address}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>City</p>
                  <p className='font-semibold'>{orderData?.shippingAddress?.city}</p>
                </div>
              </div>
              <div className=' border m-2 w-96  flex-col flex items-start justify-start py-2 px-4'>
                <h1 className='text-xl font-semibold '>Other Details</h1>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Items Price</p>
                  <p className='font-semibold'>$ {orderData?.itemsPrice}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Sipping Price</p>
                  <p className='font-semibold'>$ {orderData?.shippingPrice}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Tax Price</p>
                  <p className='font-semibold'>$ {orderData?.taxPrice}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Total Price</p>
                  <p className='font-semibold'>$ {orderData?.totalPrice}</p>
                </div>
                <div className='flex py-2 w-full text-sm justify-between'>
                  <p>Is Paid</p>
                  <p className='font-semibold'>{orderData?.isPaid ? "Done" : "Pending"}</p>
                </div>
              </div>
            </div>
            {orderData && (
              orderData.isDelivered ? (
                <div className='w-full flex justify-center'>
                  <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-md font-large px-4 py-2 rounded-full dark:bg-green-900 dark:text-green-300">
                    <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                    Delivered
                  </span>
                </div>
              ) : (
                <div className='w-full flex justify-center'>
                  <button
                    className='w-20 py-2 text-xs text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded transition-all duration-700'
                    onClick={() => deliverAction(orderData?._id || '')}
                  >
                    Deliver
                  </button>
                </div>
              )
            )}
          </div>
      }
      <ToastContainer />
    </div>
  )
}