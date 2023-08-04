"use client"

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { get_all_orders } from '@/Services/Admin/order';
import Loading from '@/app/loading';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

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

interface userData {
  _id: String,
  name: String
  email: String,
  role: String,
}

export default function Orders() {
  const Router = useRouter();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');

    if (!Cookies.get('token') || !user) {
      Router.push('/');
    }
  }, [Router]);

  const [orderData, setOrderData] = useState<OrderData[] | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR('/gettingAllOrders',  get_all_orders);

  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const handleSearch = async (search: string) => {
    setSearch(search);

    if (search == '') {
      setOrderData(data);
    } else {
      const filteredData = data.filter((item: OrderData) => {
        const itemID = item?._id.toLowerCase();
        const text = search.toLowerCase();

        return itemID.indexOf(text) > -1;
      });

      setOrderData(filteredData);
    }
  }

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
      name: 'Total Price',
      selector: (row: OrderData) => '$' + row?.totalPrice,
      sortable: true,
    },
    {
      name: 'Product Counts',
      selector: (row: OrderData) => row?.orderItems.length,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: OrderData) => row?.isDelivered ? 'Done' : 'Pending',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: OrderData) => (
        <button
          onClick={() => Router.push(`/orders/order-detail/${row?._id}`)}
          className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'
        >
          Details
        </button>
      )
    },
  ];

  return (
    <div className='w-full min-h-screen flex bg-gray-50'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div className='w-full px-4 py-2'>
          {orderData
            ?
            <DataTable
              columns={columns}
              data={orderData}
              pagination
              title={`Orders list`}
              fixedHeader
              fixedHeaderScrollHeight='100%'
              selectableRows
              selectableRowsHighlight
              persistTableHead
              progressPending={isLoading}
              subHeader
              subHeaderComponent={
                <input
                  className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600'
                  type="search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Orders ID..."
                />
              }
              className="bg-white px-4 h-5/6 "
            />
            : <Loading />
          }
        </div>
      </div>
    </div>
  )
}