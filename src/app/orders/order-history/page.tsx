"use client"

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { get_customer_orders } from '@/Services/Common/order';
import Loading from '@/app/loading';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

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
      productCategory: string;
      productDescription: string;
      productFeatured: boolean;
      productImage: string;
      productName: string;
      productPrice: number;
      productQuantity: number;
      productSlug: string;
      updatedAt: string;
      _id: string;
    };
    _id: string;
  }[];
  paidAt: string;
  shippingAddress: {
    address: string;
    city: string;
    fullName: string;
  };
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  updatedAt: string;
  _id: string;
}

interface userData {
  name: String,
  email: String,
  role: String,
  _id: String,
}

export default function Orders() {
  const Router = useRouter();

  const [userID, setUserID] = useState<String>('');
  const [orderData, setOrderData] = useState<OrderData[] | null>(null);

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');

    if (!Cookies.get('token') || user === null) {
      Router.push('/');
    }

    setUserID(user?._id || '');
  }, [Router]);

  const { data, isLoading } = useSWR(userID != '' ? '/gettingCustomerOrders' : null, () => get_customer_orders(userID));

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data.data);
    }
  }, [data]);

  const columns = [
    {
      name: 'Order ID',
      selector: (row: OrderData) => row?._id,
      sortable: true,
    },
    {
      name: 'Customer Name',
      selector: (row: OrderData) => row?.shippingAddress.fullName,
      sortable: true,
    },
    {
      name: 'Product Counts',
      selector: (row: OrderData) => row?.orderItems.length,
      sortable: true,
    },
    {
      name: 'Total Price',
      selector: (row: OrderData) => '$' + row?.totalPrice,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: OrderData) => row?.isDelivered ? 'Done' : 'Pending',
      sortable: true,
    },
    {
      name: 'Order Date',
      selector: (row: OrderData) => row?.createdAt.substring(0, 10),
      sortable: true,
    },
  ];

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
          <p className="text-2xl ml-2">Order History</p>
        </div>

        <div className='w-full px-4 py-2'>
          {orderData
            ?
            <DataTable
              columns={columns}
              data={orderData}
              pagination
              fixedHeader
              fixedHeaderScrollHeight='100%'
              selectableRows
              selectableRowsHighlight
              persistTableHead
              progressPending={isLoading}
              className="bg-white px-4 h-5/6 "
            />
            : <Loading />
          }
        </div>
      </div>
      <Footer />
    </>
  )
}