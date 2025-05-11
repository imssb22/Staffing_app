'use client'
import { useState, KeyboardEvent, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Skill } from '../../../interfaces'
import dotenv from "dotenv";
import { useSelector } from 'react-redux'
import { RootState } from '@/public/store'

dotenv.config();

export default function AddSkills() {
    const token = useSelector((state: RootState) => state.auth.token);
    type SkillInput = Omit<Skill, "developer_id">
    const [skills, setSkills] = useState<SkillInput[]>([])
    const [currentSkill, setCurrentSkill] = useState('')
    const [currentProficiency, setCurrentProficiency] = useState('Beginner')
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [prev, setPrev] = useState<SkillInput[]>([])
    const [refresh, setRefresh] = useState(false);
    const router = useRouter()

    useEffect(() => {
        getSkills()
    }, [refresh]) // Remove skills dependency to prevent infinite loop

    const getSkills = async() => {
        try {
            setPrev(skills);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dev/getskills`,
                {
            
              headers: {
                'Authorization': token
              
            }
          }
            )
            setSkills(response.data[0].skills)
            if(prev!==skills){
                setRefresh(true);
            }
        } catch(e) {
            console.log(e)
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentSkill.trim() !== '') {
            if (editingIndex !== null) {
                // Update existing skill
                const updatedSkills = [...skills]
                updatedSkills[editingIndex] = {
                    name: currentSkill.trim(),
                    proficiency: currentProficiency
                }
                setSkills(updatedSkills)
                setEditingIndex(null)
            } else {
                // Add new skill
                setSkills([...skills, {
                    name: currentSkill.trim(),
                    proficiency: currentProficiency
                }])
            }
            setCurrentSkill('')
            setCurrentProficiency('Beginner')
        }
    }

    const removeSkill = (indexToRemove: number) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/dev/addskills`, 
                { skills },
                  {
            
              headers: {
                'Authorization': token
              
            }
          }
            )
            router.push('/dev/addskills') // Or wherever you want to redirect after success
        } catch (error) {
            console.error('Error adding skills:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text mb-6 text-center">
                    {editingIndex !== null ? 'Edit Skill' : 'Add Your Skills'}
                </h1>

                <div className="mb-6">
                    <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={editingIndex !== null ? "Edit skill and press Enter" : "Type a skill and press Enter"}
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <select
                        value={currentProficiency}
                        onChange={(e) => setCurrentProficiency(e.target.value)}
                        className="mt-2 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {skills.map((skill, index) => (
                        <div 
                            key={index}
                            className={`px-3 py-1 rounded-full flex items-center ${
                                editingIndex === index ? 'bg-yellow-200' : 'bg-blue-600'
                            }`}
                        >
                            <span>{skill.name} - {skill.proficiency}</span>
                            <div className="ml-2 flex gap-1">
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:scale-105 transition"
                >
                    Save All Skills
                </button>
            </div>
        </div>
    )
}
