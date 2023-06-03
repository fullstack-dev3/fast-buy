"use client"

import React, { useEffect, useState, FormEvent } from 'react'
import { useDispatch } from 'react-redux';
import { TailSpin } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import { login_me } from '@/Services/auth';
import { setUserData } from '@/utils/UserDataSlice';

export default function Login() {
  const dispatch = useDispatch();
  const Router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [loading, setLoding] = useState<Boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoding(true);

    if (!formData.email) {
      setError({ ...error, email: "Email Field is Required" })
      return;
    }

    if (!formData.password) {
      setError({ ...error, password: "Password Field is required" })
      return;
    }

    const res = await login_me(formData);

    if (res.success) {
      setLoding(false);

      Cookies.set('token', res?.finalData?.token);
      localStorage.setItem('user', JSON.stringify(res?.finalData?.user));

      const userData = localStorage.getItem('user');
      const userDataString = typeof userData === 'string' ? userData : '';

      dispatch(setUserData(JSON.parse(userDataString)));

      if (res?.finalData?.user?.role === 'admin') {
        Router.push('/dashboard');
      } else {
        Router.push('/');
      }
    } else {
      setLoding(false);
      toast.error(res.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className='w-full h-screen bg-base-100'>
        <div className="flex flex-col items-center  text-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white text-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in to your account
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div className='text-left'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 "
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
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300 dark:focus:ring-orange-600 "
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <Link href="/auth/reset" className="text-sm font-medium text-orange-600 hover:underline ">
                    Forgot password ?
                  </Link>
                </div>
                {loading
                  ?
                    <button
                      type="button"
                      className="w-full flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                      <TailSpin
                        ariaLabel="tail-spin-loading"
                        color="white"
                        height="20"
                        radius="1"
                        visible={true}
                        width="20"
                        wrapperClass=""
                        wrapperStyle={{}}
                      />
                    </button>
                  :
                    <button
                      type="submit"
                      className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                      Sign in
                    </button>
                }
                <p className="text-sm text-black ">
                  Don’t have an account yet?
                  <Link href="/auth/register" className="ml-1 font-medium text-orange-600 hover:underline ">
                    Sign up
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
