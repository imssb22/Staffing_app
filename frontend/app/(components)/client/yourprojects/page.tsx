'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dotenv from "dotenv";
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../public/store';
import Link from 'next/link'

dotenv.config();
interface Developer {
  id : string,
  name: string,
  YOE: number,
  email: string,
  phone: string,
  password: string,
  hrate : number,
  rating: number

}
interface Project {
  id: string
  name: string
  roomid : string
  budget: number
  timeline: number
  required_developers: number
  Assigned_developers: Array<Developer>
}
interface MergedProject extends Project {
  Assigned_developers: Developer[];
}
export default function YourProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [creatorName, setCreatorName] = useState("")
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
  if (!token) return;
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/myprojects`)
        // console.log(response.data.projects)
        // let devs = [];

        const projectData = response.data.projects;
        const ids = projectData.map((item : Project) => item.id)
        // console.log(ids)
        const devs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/assigneddevs`, { ids: ids },
        );
        // console.log("devs: " ,devs.data)
        

        const mergedProjects: MergedProject[] = projectData.map((project: Project, idx: number) => ({
          ...project,
          Assigned_developers: devs.data[idx]?.Assigned_developers || [],
        }));
        
        setProjects(mergedProjects);
        
        setCreatorName(response.data.username)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch projects, Try refreshing once')
        setLoading(false)
        console.log(err)
      }
    }
    // const getUsername = async() => {
    //   try{}
    // }
    fetchProjects()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/30 backdrop-blur-2xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">{project.name}</h2>

                <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-200">Created By:</span>
                    <span className="font-medium text-white">{creatorName} </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Budget:</span>
                    <span className="font-medium text-white">${project.budget}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-200">Timeline:</span>
                    <span className="font-medium text-white">{project.timeline} days</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-200">Required Developers:</span>
                    <span className="font-medium text-white">{project.required_developers}</span>
                  </div>
                  <div>
                  <button
                    onClick={() => router.push(`/chat/${project.roomid}/view`)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-2xl hover:scale-105 transition font-semibold"
                  >
                    View Chats
                  </button>
                  </div>
                  {/* Optional: Assigned Developers */}
                  <div className="border-t pt-3 mt-3">
                    <h3 className="text-gray-200 mb-2">Assigned Developers:</h3>
                    {Array.isArray(project.Assigned_developers) && project.Assigned_developers.length > 0 ? (
                      <div className="space-y-1">
                        {project.Assigned_developers.map(dev => (
                          
                          <div key={dev.id} className="text-sm text-white">
                            <Link href={`devinfo/${dev.id}/view`}>{dev.name}</Link>
                            
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">No developers assigned.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-white">
            <p className="text-xl">You havent created any projects yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
