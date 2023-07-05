"use client"

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/utils/Firebase';
import { get_all_categories } from '@/Services/Common/category';
import { add_new_product } from '@/Services/Admin/product';

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

type Inputs = {
  name: string,
  description: string,
  slug: string,
  featured: Boolean,
  price: Number,
  quantity:  Number,
  categoryID: string,
  image: Array<File>,
  fileName: string,
}

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
}

let fileName = '';

const uploadImages = async (slug: string, file: File) => {
  const orgName = file?.name.split('.');
  const ext = orgName[orgName.length - 1];

  fileName = slug + '-' + Math.random().toString(36).substring(2, 8) + '.' + ext;

  const storageRef = ref(storage, `ecommerce/product/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', (snapshot) => {
    }, (error) => {
      console.log(error);
      reject(error);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  });
}

const maxSize = (value: File) => {
  const fileSize = value.size / 1024 / 1024;
  return fileSize < 1 ? false : true;
}

export default function AddProduct() {
  const Router = useRouter();

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin') {
      Router.push('/');
    }
  }, [Router]);

  let { data: categories } = useSWR('/gettingAllCategories', get_all_categories);

  if (categories && categories.length > 0) {
    categories.sort(function(a: CategoryData, b: CategoryData) {
      return a.name > b.name ? 1 : -1;
    });
  }

  const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoader(true);

    const CheckFileSize = maxSize(data.image[0]);
    if (CheckFileSize) {
      return toast.error('Image size must be less than 1MB');
    }

    const uploadImageToFirebase = await uploadImages(data.slug, data.image[0]);
    const finalData = {
      name: data.name,
      description: data.description,
      image: uploadImageToFirebase,
      fileName: fileName,
      slug: data.slug,
      featured: data.featured,
      price: data.price,
      quantity: data.quantity,
      category : data.categoryID
    }

    const res = await add_new_product(finalData);
    if (res.success) {
      toast.success(res?.message);
      setTimeout(() => {
        Router.push('/products');
      }, 2000);
      setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  }

  return (
    <div className='w-full p-4 min-h-screen bg-gray-50 flex flex-col'>
      <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
        <ul className='dark:text-black'>
          <li>
            <Link href={'/products'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Products
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Add Product
          </li>
        </ul>
      </div>
      <div className='w-full h-20 my-2 text-center'>
        <h1 className='text-2xl py-2 dark:text-black'>Add Product</h1>
      </div>
      {
        loader ? (
          <div className='w-full flex-col h-96 flex items-center justify-center'>
            <TailSpin
              ariaLabel="tail-spin-loading"
              color="orange"
              height="50"
              radius="1"
              visible={true}
              width="50"
            />
            <p className='text-sm mt-2 font-semibold text-orange-500'>
              Adding Product Hold Tight ....
            </p>
          </div>
        ) : (
          <div className='w-full h-full flex items-start justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg py-2 flex-col">
              <div className="form-control w-full mb-2">
                <select
                  {...register("categoryID", { required: true })}
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
                {errors.categoryID &&
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
                  type="text" placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.price &&
                  <span className='text-red-500 text-xs mt-2'>This field is required</span>
                }
              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Quantity</span>
                </label>
                <input
                  {...register("quantity", { required: true })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                {errors.quantity &&
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
              <div className="form-control my-2">
                <label className="cursor-pointer label">
                  <span className="label-text">Featured Product</span>
                  <input
                    {...register("featured")}
                    type="checkbox"
                    className="checkbox"
                  />
                </label>
              </div>
              <div className="form-control w-full ">
                <label className="label">
                  <span className="label-text">Add product Image</span>
                </label>
                <input
                  {...register("image", { required: true })}
                  accept="image/*"
                  max="1000000"
                  type="file"
                  className="file-input file-input-bordered w-full"
                />
                {errors.image &&
                  <span className='text-red-500 text-xs mt-2'>
                    This field is required and the image must be less than or equal to 1MB.
                  </span>
                }
              </div>
              <button className='btn btn-block mt-3'>Done !</button>
            </form>
          </div>
        )
      }
      <ToastContainer />
    </div>
  )
}
