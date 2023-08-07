"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { BsPlusCircleFill } from 'react-icons/bs';
import useSWR, { mutate } from 'swr';
import { ref, deleteObject  } from 'firebase/storage';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { storage } from '@/utils/Firebase';
import { get_all_categories } from '@/Services/Common/category';
import { delete_a_category } from '@/Services/Admin/category';
import Loading from '@/app/loading';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
}

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  fileName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export default function Categories() {
  const router =  useRouter();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  const [catData, setCatData] = useState<CategoryData[] | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useSWR('/gettingAllCategories', get_all_categories);

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setCatData(data);
  }, [data]);

  const columns = [
    {
      name: 'Name',
      selector: (row: CategoryData) => row?.name,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row: CategoryData) => (
        <Image src={row?.image} alt='No Image Found' className='py-2' width={100} height={100} />
      )
    },
    {
      name: 'Action',
      cell: (row: CategoryData) => (
        <div className='flex items-center justify-start px-2 h-20'>
          <button
            onClick={() => router.push(`/admin/categories/update-category/${row?._id}`)}
            className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteCategory(row?._id, row?.fileName)}
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
      setCatData(data);
    } else {
      const filteredData = data.filter((item: CategoryData) => {
        const itemName = item?.name.toLowerCase();
        const text = search.toLowerCase();
        return itemName.indexOf(text) > -1;
      });

      setCatData(filteredData);
    }
  }

  const handleDeleteCategory = async (id: string, fileName: string)  => {
    const storageRef = ref(storage, `ecommerce/category/${fileName}`);
    
    await deleteObject(storageRef);

    const res = await delete_a_category(id);

    if (res?.success) {
      toast.success(res?.message);
      mutate('/gettingAllCategories')
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
          {catData
            ?
            <>
              <button
                className="flex items-center text-white my-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => router.push(`/admin/categories/add-category`)}
              >
                <BsPlusCircleFill className='mr-2' />
                Add New
              </button>
              <DataTable
                columns={columns}
                data={catData}
                pagination
                title={`Total Categories : ${catData?.length}`}
                fixedHeader
                fixedHeaderScrollHeight='100%'
                selectableRows
                selectableRowsHighlight
                persistTableHead
                progressPending={isLoading}
                subHeader
                subHeaderComponent={
                  <input
                    className='w-60 dark:bg-transparent py-2 px-2 outline-none border-b-2 border-orange-600'
                    type="search"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search..."
                  />
                }
                className="bg-white"
              />
            </>
            : <Loading />
          }
        </div>
      </div>
    </div>
  )
}
