'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setAuthCookie } from '../_cookies/cookies';
import Link from 'next/link';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../public/store';
import { login } from '@/public/features/authSlice';
import dotenv from "dotenv";
dotenv.config();

export default function DeveloperSignin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) {
      router.push('/dev/home');
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/dev/signin`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data) {
        alert('Login failed');
        return;
      }
      console.log(response.data)
      
      const { token, role, username, userId } = response.data;
      console.log(username, " ", userId, " ")
      localStorage.setItem('token', token);
      setAuthCookie(token);
      dispatch(
        login({
          token : token,
          isAuthenticated: true,
          email: formData.email,
          username : username,
          role : role,
          userId : userId,
        })
      );
      router.push('/dev/home');
    } catch (e) {
      console.error(e);
      alert('Something went wrong');
    }
  };

  if (token) {
    // Optionally, show a loading spinner or nothing while redirecting
    return null;
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-screen w-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-0 left-0 animate-pulse"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />

      {/* Sign In Card */}
      <motion.div
        className="relative z-10 bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center mb-6">
          Developer Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              className="peer px-4 py-3 w-full rounded-xl border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none bg-transparent text-sm text-white placeholder-transparent"
            />
           <label
                className="absolute left-4 top-3 text-cyan-400 text-sm transition-all
                  peer-placeholder-shown:top-3.5 
                  peer-placeholder-shown:text-gray-500 
                  peer-focus:top-0 
                  peer-focus:text-xs 
                  peer-focus:text-cyan-300
                  peer-[&:not(:placeholder-shown)]:top-0
                  peer-[&:not(:placeholder-shown)]:text-xs
                  peer-[&:not(:placeholder-shown)]:text-cyan-300">
              Email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              className="peer px-4 py-3 w-full rounded-xl border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 outline-none bg-transparent text-sm text-white placeholder-transparent"
            />
            <label
                className="absolute left-4 top-3 text-cyan-400 text-sm transition-all
                  peer-placeholder-shown:top-3.5 
                  peer-placeholder-shown:text-gray-500 
                  peer-focus:top-0 
                  peer-focus:text-xs 
                  peer-focus:text-cyan-300
                  peer-[&:not(:placeholder-shown)]:top-0
                  peer-[&:not(:placeholder-shown)]:text-xs
                  peer-[&:not(:placeholder-shown)]:text-cyan-300">
              Password
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-5 text-xs">
          New Developer?{' '}
          <Link href="/devsignup" className="text-cyan-400 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}