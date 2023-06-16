"use client"

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { get_all_categories } from '@/Services/Common/category';
import { get_product_by_id } from '@/Services/Common/product';
import { update_a_product } from '@/Services/Admin/product';

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
  category: CategoryData,
  createdAt: string;
  updatedAt: string;
};

type Inputs = {
  _id: string,
  name: string,
  description: string,
  slug: string,
  featured: Boolean,
  price: Number,
  quantity:  Number,
  category: string,
}

interface pageParam {
  id: string
}

export default function Page({ params, searchParams }: { params: pageParam, searchParams: any }) {
  const Router = useRouter();

  const [loader, setLoader] = useState(false);
  const [prodData, setProdData] = useState<ProductData | undefined>(undefined);

  const { data: categories } = useSWR('/gettingAllCategories', get_all_categories);
  const { data, isLoading } = useSWR('/gettingProductByID', () => get_product_by_id(params.id));

  const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });

  if (data?.success !== true) {
    toast.error(data?.message);
  }

  useEffect(() => {
    setProdData(data?.data)
  }, [data]);

  useEffect(() => {
    if (prodData) {
      setValue('name', prodData?.name)
      setValue('description', prodData?.description)
      setValue('slug', prodData?.slug)
      setValue('featured', prodData?.featured)
      setValue('category', prodData?.category._id)
      setValue('quantity', prodData?.quantity)
      setValue('price', prodData?.price)
    }
  }, [prodData, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoader(false);

    const updatedData: Inputs = {
      _id: params.id,
      name: data.name !== prodData?.name ? data.name : prodData?.name,
      description: data.description !== prodData?.description ? data.description : prodData?.description,
      slug: data.slug !== prodData?.slug ? data.slug : prodData?.slug,
      featured: data.featured !== prodData?.featured ? data.featured : prodData?.featured,
      quantity: data.quantity !== prodData?.quantity ? data.quantity : prodData?.quantity,
      price: data.price !== prodData?.price ? data.price : prodData?.price,
      category: data.category !== prodData?.category._id ? data.category : prodData?.category._id,
    };

    const res = await update_a_product(updatedData)
    if (res?.success) {
      toast.success(res?.message);
      setTimeout(() => {
        Router.push("/products");
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
            <Link href={'/products'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Products
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Update Product
          </li>
        </ul>
      </div>
      <div className='w-full h-20 my-2 text-center'>
        <h1 className='text-2xl py-2 '>Update Product</h1>
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
              Updating product Hold Tight ....
            </p>
          </div>
        ) : (
          <div className='w-full h-full flex items-start justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col ">
              <div className="form-control w-full max-w-full">
                <label className="label">
                  <span className="label-text">Choose Category</span>
                </label>
                <select
                  {...register("category", { required: true })}
                  className="select select-bordered w-full mb-2"
                >
                  <option value="">Choose Product Category</option>
                  {
                    categories?.map((item: CategoryData) => {
                      return (
                        <option key={item._id} value={item._id}>{item.name}</option>
                      )
                    })
                  }
                </select>
                {errors.category &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label >
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.name &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div >
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Slug</span>
                </label>
                <input
                  {...register("slug", { required: true })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.slug &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Price</span>
                </label>
                <input
                  {...register("price", { required: true })}
                  type="number"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.slug &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Quantity</span>
                </label>
                <input
                  {...register("quantity", { required: true })}
                  type="number"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.slug &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Description</span>
                </label>
                <textarea
                  {...register("description", { required: true })}
                  className="textarea textarea-bordered h-24"
                  placeholder="Description"
                />
                {errors.description &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control py-2">
                <label className="label cursor-pointer">
                  <span className="label-text">Featured Product</span>
                  <input
                    {...register("featured")}
                    type="checkbox"
                    className="checkbox"
                  />
                </label>
              </div>
              {
                prodData && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Product Image</span>
                    </label>
                    <Image src={prodData?.image || ""} alt='No Image Found' width={200} height={200} />
                  </div>
                )
              }
              <button className='btn btn-block mt-3'>Done !</button>
            </form >
          </div >
        )
      }
      <ToastContainer />
    </div >
  )
}
