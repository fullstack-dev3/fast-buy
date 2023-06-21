"use client"

import React, { useEffect, useState } from 'react';
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
  category: {
    _id: string,
    name: string,
  },
  createdAt: string;
  updatedAt: string;
};

export default function Products() {
  const router =  useRouter();

  const [prodData, setProdData] = useState<ProductData[] | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR('/gettingAllProducts', get_all_products);

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setProdData(data);
  }, [data]);

  const columns = [
    {
      name: 'Name',
      selector: (row: ProductData) => row?.name,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row: ProductData) => row?.category?.name,
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

  const handleSearch = async (search: string) => {
    setSearch(search);

    if (search == '') {
      setProdData(data);
    } else {
      const filteredData = data.filter((item: ProductData) => {
        const itemName = item?.name.toLowerCase();
        const catName = item?.category.name.toLowerCase();
        const text = search.toLowerCase();

        return itemName.indexOf(text) > -1 || catName.indexOf(text) > -1;
      });

      setProdData(filteredData);
    }
  }

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
    <div className='w-full min-h-screen flex bg-gray-50'>
      <AdminSidebar />
      <div className='w-full min-h-screen'>
        <AdminNavbar />
        <div className='w-full px-4 py-2'>
          {prodData
            ?
            <DataTable
              columns={columns}
              data={prodData}
              pagination
              title={`Total Products : ${prodData?.length}`}
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
                  placeholder="Search..."
                />
              }
              className="bg-white"
            />
            : <Loading />
          }
        </div>
      </div>
    </div>
  )
}
