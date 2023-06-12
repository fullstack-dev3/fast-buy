"use client"

import React from 'react';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import useSWR, { mutate } from 'swr';
import { ref, deleteObject  } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { storage } from '@/utils/Firebase';
import { get_all_products } from '@/Services/Common/product';
import { delete_a_product } from '@/Services/Admin/product';
import Loading from '@/app/loading';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

type ProductData = {
  _id: string,
  name: string,
  description: string,
  image: string,
  fileName: string,
  slug: string,
  price: Number,
  quantity: Number,
  featured: Boolean,
  category: string,
  createdAt: string;
  updatedAt: string;
};

export default function Products() {
  const router =  useRouter();

  const { data, isLoading } = useSWR('/gettingAllProducts', get_all_products);

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: ProductData) => row?.name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row: ProductData) => row?.price.toString(),
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: (row: ProductData) => row?.quantity.toString(),
      sortable: true,
    },
    {
      name: 'Featured',
      cell: (row: ProductData) => (
        row?.featured ? <span>Featured</span> : ''
      )
    },
    {
      name: 'Image',
      cell: (row: ProductData) => (
        <Image src={row?.image} alt='No Image Found' className='py-2' width={100} height={100} />
      )
    },
    {
      name: 'Action',
      cell: (row: ProductData) => (
        <div className='flex items-center justify-start px-2 h-20'>
          <button
            onClick={() => router.push(`/products/update-product/${row?._id}`)}
            className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteProduct(row?._id, row?.fileName)}
            className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'
          >
            Delete
          </button>
        </div>
      )
    },
  ];

  const handleDeleteProduct = async (id: string, fileName: string)  => {
    const storageRef = ref(storage, `ecommerce/product/${fileName}`);
    
    await deleteObject(storageRef);

    const res = await delete_a_product(id);

    if (res?.success) {
      toast.success(res?.message);
      mutate('/gettingAllProducts')
    } else {
      toast.error(res?.message);
    }
  }

  return (
    <div className='w-full min-h-screen flex bg-base-200'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div className='w-full px-4 py-2'>
          {data
            ?
            <DataTable
              columns={columns}
              data={data}
              key={data?._id}
              pagination
              title={`Total Products : ${data?.length}`}
              fixedHeader
              fixedHeaderScrollHeight='100%'
              selectableRows
              selectableRowsHighlight
              persistTableHead
              progressPending={isLoading}
              className="bg-white px-4"
            />
            : <Loading />
          }
        </div>
      </div>
    </div>
  )
}
