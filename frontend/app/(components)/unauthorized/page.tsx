"use client";

import { useRouter } from "next/navigation";
import { LockIcon, ArrowLeftIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/public/store";


export default function Unauthorized() {
  const router = useRouter();
  let role = useSelector((state:RootState)=>state.auth.role)
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-xl">
        <div className="mb-8">
          <LockIcon className="w-16 h-16 mx-auto text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unauthorized Access 🚫
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          You do not have permission to view this page. Please check your access rights or return to the homepage.
        </p>
        <button
          onClick={() => router.push(`/${role}/home`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Go Back Home
        </button>
      </div>
    </main>
  );
}