"use client"

import React, { useState , useEffect , FormEvent } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { register_me } from '@/Services/auth';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('user') && Cookies.get('token')) {
      router.push('/');
    }
  });

  const [formData, setFormData] = useState({ email: "", password: "" , name : "" });
  const [error, setError] = useState({ email: "", password: "", name: '' });
  const [loading , setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    let nameError = '';
    let emailError = '';
    let passError = '';
    if (!formData.name) {
      nameError = "Name field is required";
    }
    if (!formData.email) {
      emailError = "Email field is required";
    }
    if (!formData.password) {
      passError = "Password field is required";
    }
    if (emailError != '' || passError != '') {
      setLoading(false);
      setError({
        name: nameError,
        email: emailError,
        password: passError
      });

      return;
    }

    const data = await register_me(formData);
    if (data.success) {
      setLoading(false);

      toast.success(data.message);

      router.push('/auth/login');
    } else {
      setLoading(false);
      toast.error(data.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className='w-full h-screen bg-gray-50 '>
        <div className="flex flex-col text-center items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 shadow-xl">
          <div className="w-full bg-white rounded-lg shadow text-black md:mt-0 sm:max-w-md xl:p-0">
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
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      const name = e.target.value == '' ? "Name field is required" : '';
                      setError({ name, email: error.email, password: error.password });
                    }}
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
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      const email = e.target.value == '' ? "Email field is required" : '';
                      setError({ name: error.name, email, password: error.password });
                    }}
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
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      const password = e.target.value == '' ? "Password field is required" : '';
                      setError({ name: error.name, email: error.email, password })
                    }}
                  />
                  {error.password && <p className="text-sm text-red-500">{error.password}</p>}
                </div>

                {loading
                  ?
                    <button
                      type="button"
                      className="w-full flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                      className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Sign up
                    </button>
                }
                <p className="text-sm  text-gray-500 ">
                  Already have an account
                  <Link href={"/auth/login"} className="ml-1 font-medium text-orange-600 hover:underline ">
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
