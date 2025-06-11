'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import SignupPromptModal from '../signupPromptModal/SignupPromptModal';
import { RootState } from '../../../public/store';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return  (<>
    {!token ?(
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white flex flex-col overflow-x-hidden">
      {/* Navbar with signup modal handler */}
      <Navbar onSignupClick={openModal} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center py-48 px-4">
          {/* Background effect */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent opacity-50 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          <motion.h1
            className="text-6xl md:text-7xl font-extrabold text-blue-500 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            Build the Future
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-300 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Sarvesh, launch, and scale your project with a platform that feels like magic.
          </motion.p>

          <button
            onClick={openModal}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out z-10"
          >
            Get Started
          </button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-16 text-center">
            {['Fast', 'Elegant', 'Scalable'].map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-8 rounded-3xl shadow-md bg-gray-700 hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-4">{feature}</h3>
                <p className="text-gray-300">
                  {feature === "Fast" && "Built for speed and efficiency from the ground up."}
                  {feature === "Elegant" && "Sophisticated design meets effortless functionality."}
                  {feature === "Scalable" && "From startups to enterprises, we grow with you."}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-gray-900">
          <div className="max-w-5xl mx-auto text-center px-6">
            <motion.h2
              className="text-5xl font-bold text-blue-500 mb-8"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              About Us
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Our mission is to create digital experiences that feel intuitive, effortless, and extraordinary.
            </motion.p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-gray-800">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.h2
              className="text-5xl font-bold text-blue-500 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              Let’s Connect
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Whether you’re curious about features or just want to chat — we’re here for it.
            </motion.p>

            <motion.a
              href="/contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold shadow-md hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.1 }}
            >
              Contact Us
            </motion.a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Signup Prompt Modal */}
      {isModalOpen && (
        <SignupPromptModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>)
  : (router.push(`/home`), null)}</>)
}
