"use client"

import React, { useState , useEffect , FormEvent } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import { register_me } from '@/Services/auth';

export default function  Register (){
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('token')) {
      router.push('/');
    }
  },[router]);
  
  const [formData, setFormData] = useState({ email: "", password: "" , name : "" });
  const [error, setError] = useState({ email: "", password: "", name: '' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email) {
      setError({ ...error, email: "Email Field is Required" })
      return;
    }

    if (!formData.password) {
      setError({ ...error, password: "Password Field is required" })
      return;
    }

    if (!formData.name ) {
      setError({ ...error, name: "Name Field is required" })
      return;
    }

    const data = await register_me(formData);
    if (data.success) {
      toast.success(data.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } else {
      toast.error(data.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className='w-full h-screen bg-base-100 '>
        <div className="flex flex-col text-center items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 shadow-xl">
          <div className="w-full bg-white rounded-lg shadow dark:border text-black md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Register your account
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div className='text-left'>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="namw"
                    name="name"
                    placeholder="Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {error.name && <p className="text-sm text-red-500">{error.name}</p>}
                </div>
                <div className='text-left'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {error.email && <p className="text-sm text-red-500">{error.email}</p>}
                </div>
                <div className='text-left'>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {error.password && <p className="text-sm text-red-500">{error.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Sign up
                </button>
                <p className="text-sm  text-gray-500 ">
                  Already have an account
                  <Link href="/auth/login" className="ml-1 font-medium text-orange-600 hover:underline ">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  )
}
