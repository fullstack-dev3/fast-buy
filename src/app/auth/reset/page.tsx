"use client"

import React, { useEffect, useState, FormEvent } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { forget_password } from '@/Services/auth';

export default function ForgetPassword() {
  const Router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user') && Cookies.get('token')) {
      Router.push('/');
    }
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    let emailError = '';
    let passError = '';
    let confirmError = '';
    if (!formData.email) {
      emailError = "Email field is required";
    }
    if (!formData.password) {
      passError = "Password field is required";
    }
    if (!formData.confirmPassword) {
      confirmError = "Confirm Password field is required";
    }
    if (emailError != '' || passError != '') {
      setLoading(false);
      setError({
        email: emailError,
        password: passError,
        confirmPassword: confirmError
      });

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password does not match");
    }

    const res = await forget_password(formData);
    if (res.success) {
      setLoading(false);

      toast.success(res.message);

      Router.push('/auth/login');
    } else {
      setLoading(false);
      toast.error(res.message);
    }
  }

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 text-center">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow  md:mt-0 sm:max-w-md  sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Change Password
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5" >
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
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    const email = e.target.value == '' ? "Email field is required" : '';
                    setError({ email, password: error.password, confirmPassword: error.confirmPassword });
                  }}
                />
                {error.email && <p className="text-sm text-red-500">{error.email}</p>}
              </div>
              <div className='text-left'>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 "
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    const password = e.target.value == '' ? "Password field is required" : '';
                    setError({ email: error.email, password, confirmPassword: error.confirmPassword })
                  }}
                />
                {error.password && <p className="text-sm text-red-500">{error.password}</p>}
              </div>
              <div className='text-left'>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 "
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    const confirmPassword = e.target.value == '' ? "Confirm Password field is required" : '';
                    setError({ email: error.email, password: error.password, confirmPassword })
                  }}
                />
                {error.confirmPassword && <p className="text-sm text-red-500">{error.confirmPassword}</p>}
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
                    />
                  </button>
                :
                  <button
                    type="submit"
                    className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                  >
                    Reset
                  </button>
              }
            </form>
          </div>
        </div>

        <ToastContainer />
      </section>
    </>
  )
}
