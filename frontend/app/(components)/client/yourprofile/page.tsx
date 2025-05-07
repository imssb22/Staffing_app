'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react'; // using Lucide icons
import axios from 'axios';
import Footer from '../../footer/Footer';
import { User } from '../../../interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '@/public/store';
import dotenv from "dotenv";
dotenv.config();

export default function ProfilePage() {
  const [User, setUser] = useState<User>({
    name: 'John Doe',
    company: "xyz",
    email: 'john@example.com',
    phone: '+1234567890',
    password: '********',
    rating: 4.5,
    id: "x"
  });
  const token = useSelector((state: RootState)=>state.auth.token)
  const [isEditing, setIsEditing] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  

  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/info`,
          {
            headers: {
              Authorization: token,
            }
          }
        );
        const data = response.data;
        setUser({
          name: data.name,
          company: data.company || "Default Company",
          email: data.email,
          phone: data.phone,
          password: data.password,
          rating: data.rating,
          id: data.id || "Default ID"
        });
      } catch (e) {
        console.log(e);
        alert("Something went wrong");
      }
    };
    getData();
  }, [User, token]);
  const startEditing = (field: keyof User) => {
    setIsEditing(field);
    setTempValue(User[field].toString());
  };

  const saveEdit = async () => {
    if (isEditing) {
      console.log(isEditing);
      try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/edit/${isEditing}`,
          { change: tempValue }
        );
        if (res.status === 200) {
          setUser(prev => ({
            ...prev,
            [isEditing]: tempValue,
          }));
        }
      } catch (e) {
        console.error(e);
        alert("Something went wrong");
      }
    }
    setIsEditing(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col overflow-x-hidden">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Profile Section */}
        <section className="relative flex flex-col items-center justify-center text-center py-32 px-4">
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent opacity-70 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 text-transparent bg-clip-text mb-12 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            User Profile
          </motion.h1>

          {/* Profile Card */}
          <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-left space-y-8 border border-white/50">
            {Object.entries(User).filter(([key]) => key !== 'id').map(([key, value], idx) => (
              <motion.div
                key={key}
                className="flex justify-between items-center border-b border-white/30 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <p className="text-sm text-gray-200 capitalize">{key}</p>
                  <p className="text-2xl font-semibold text-white tracking-wide">
                    {value}
                  </p>
                </div>
                {key !== 'rating' && (
                  <button
                    onClick={() => startEditing(key as keyof User)}
                    className="p-2 rounded-full hover:bg-white/20 transition-all"
                  >
                    <Pencil className="text-white" size={20} />
                  </button>)}
              </motion.div>
            ))}
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-2xl space-y-6 w-96">
                <h2 className="text-2xl font-bold text-blue-700">Edit {isEditing}</h2>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(null)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold hover:scale-105 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
