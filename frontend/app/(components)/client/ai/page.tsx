"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import dotenv from "dotenv";
dotenv.config();
// Add interface for API response
interface Developer {
  id: string;
  // ... other developer properties
}

interface LLMResponse {
  retrievedList: Developer[];
  timeline: number;
  budget: number;
  skills: Array<{ name: string; proficiency: string; }>;
  name: string;
}

export default function AIProjectPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response1 = await axios.post<LLMResponse>(`${process.env.NEXT_PUBLIC_API_URL}/client/llm`, {
        input: prompt 
      });
      console.log(response1);
      const retrievedList = Array.isArray(response1.data.retrievedList) 
        ? response1.data.retrievedList 
        : [];
      const ids = retrievedList.map(item => item.id);
      const timeline = response1.data.timeline;
      const budget = response1.data.budget;
      const required_developers = ids.length;
      const skills = response1.data.skills;
      const name = response1.data.name;
      console.log(ids);
      const token = localStorage.getItem('token');
      const response2 = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/getdevs`, { ids: ids },
        {
          headers: {
            'Authorization': token
          }
        }
      );
      console.log(response2);

      const project = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/addproject`,
        {
          Assigned_developers: response2.data,
          timeline: timeline,
          budget: budget,
          required_developers: required_developers,
          skills: skills,
          name: name
        },
      );

      if (project.status === 200) {
        router.push('/client/yourprojects');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 overflow-hidden flex flex-col">
      {/* Header Section - Reduced margins */}
      <section className="text-center max-w-4xl mx-auto mt-2 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Project Creation
        </h1>
        <p className="text-base text-gray-300">
          Describe your project idea, and let AI help you structure it perfectly.
        </p>
      </section>

      {/* Main Input Section - Using flex-1 to take remaining space */}
      <section className="max-w-3xl mx-auto relative flex-1 w-full flex flex-col">
        {/* Background Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <form onSubmit={handleSubmit} className="relative flex-1 flex flex-col">
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 shadow-2xl border border-white/10 relative overflow-hidden group flex-1 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col">
                <label 
                  htmlFor="prompt" 
                  className="block text-lg font-medium text-gray-200 mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your project in detail. For example: I need a mobile app for food delivery with real-time tracking..."
                  className="flex-1 min-h-0 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative group flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Project with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips Section - Reduced padding and margins */}
        <div className="mt-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-200 mb-1.5">💡 Tips for better results:</h3>
          <ul className="space-y-0.5 text-sm text-gray-300">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Be specific about features you want
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
              Mention your target audience
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
              Include any technical preferences
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}