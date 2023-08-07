"use client"

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { get_category_by_id } from '@/Services/Common/category';
import { update_a_category } from '@/Services/Admin/category';

type Inputs = {
  name: string,
  description: string,
  slug: string,
  _id: string
}

type CategoryData = {
  name: string;
  description: string;
  image: string;
  slug: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
}

interface pageParam {
  id: string
}

export default function Page({ params}: { params: pageParam }) {
  const Router = useRouter();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin') {
      Router.push('/');
    }
  }, [Router]);

  const [loader, setLoader] = useState(false)
  const [catData, setCatData] = useState<CategoryData | undefined>(undefined);

  const { data, isLoading } = useSWR('/gettingCategoryByID', () =>
    get_category_by_id(params.id)
  );

  const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setCatData(data?.data)
  }, [data]);

  useEffect(() => {
    if (catData) {
      setValue('name', catData?.name)
      setValue('description', catData?.description)
      setValue('slug', catData?.slug)
    }
  }, [catData, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoader(false);

    const updatedData: Inputs = {
      name: data.name !== catData?.name ? data.name : catData?.name,
      description: data.description !== catData?.description ? data.description : catData?.description,
      slug: data.slug !== catData?.slug ? data.slug : catData?.slug,
      _id : params.id
    };

    const res = await update_a_category(updatedData);
    if (res?.success) {
        toast.success(res?.message);

        setTimeout(() => {
          Router.push("/admin/categories");
        }, 2000);

        setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  }

  return (
    <div className='w-full p-4 min-h-screen bg-gray-50 flex flex-col dark:text-black'>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul>
          <li>
            <Link href={'/admin/categories'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Categories
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Update Category
          </li>
        </ul>
      </div>
      <div className='w-full h-20 my-2 text-center'>
        <h1 className='text-2xl py-2 '>Update Category</h1>
      </div>
      {
        isLoading || loader ? (
          <div className='w-full  flex-col h-96 flex items-center justify-center '>
            <TailSpin
              ariaLabel="tail-spin-loading"
              color="orange"
              height="50"
              radius="1"
              visible={true}
              width="50"
            />
            <p className='text-sm mt-2 font-semibold text-orange-500'>
              Updating Category Hold Tight ....
            </p>
          </div>
        ) : (
          <div className='w-full h-full flex items-start justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col ">
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.name &&
                  <span className='text-red-500 text-xs mt-2'>
                    This field is required
                  </span>
                }
              </div >
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Category Slug</span>
                </label>
                <input
                  {...register("slug")}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.slug &&
                  <span className='text-red-500 text-xs mt-2'>
                    This field is required
                  </span>
                }
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category Description</span>
                </label>
                <textarea
                  {...register("description")}
                  className="textarea textarea-bordered h-24"
                  placeholder="Description"
                />
                {errors.description &&
                  <span className='text-red-500 text-xs mt-2'>
                    This field is required
                  </span>
                }
              </div>
              {
                catData && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category Image</span>
                    </label>
                    <Image src={catData?.image || ""} alt='No Image Found' width={200} height={200} />
                  </div>
                )
              }
              <button className='btn btn-block mt-3'>Done !</button>
            </form >
          </div>
        )
      }
      <ToastContainer />
    </div >
  )
}
