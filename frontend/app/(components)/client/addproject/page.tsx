'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
// import { UserIcon, PlusCircleIcon, FolderIcon } from "lucide-react"
import axios from "axios"
import dotenv from "dotenv";
dotenv.config();

// Update the Skill interface
interface Skill {
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export default function AddProject() {
    const router = useRouter()
    const [projectData, setProjectData] = useState({
        name: "",
        budget: 0,
        timeline: 0,
        required_developers: 0,
        skills: [] as Skill[]  // Add skills array
    })
    const [currentSkill, setCurrentSkill] = useState<Skill>({
        name: "",
        proficiency: "Beginner"
    })
    const [loading, setLoading] = useState(false)
    // const [error, setError] = useState("")

    // Add skill handler
    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentSkill.name) {
            setProjectData({
                ...projectData,
                skills: [...projectData.skills, currentSkill]
            });
            setCurrentSkill({ name: "", proficiency: "Beginner" }); // Reset current skill
        }
    };

    // Remove skill handler
    const handleRemoveSkill = (index: number) => {
        setProjectData({
            ...projectData,
            skills: projectData.skills.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // setError("")

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/client/addproject`,
                projectData,
            )
            if (response.status === 200) {
                router.push('/client/home')
            }
        } catch (err) {
            // setError("Failed to create project. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
            <section className="text-center max-w-3xl mx-auto mt-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Create New Project 📝</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Add your project details and define your development requirements.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto">
                <div
                    className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition"
                >
                    <h2 className="text-2xl font-semibold mb-4">Project Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                                Project Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                value={projectData.name}
                                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-400">
                                Budget (in USD)
                            </label>
                            <input
                                type="number"
                                id="budget"
                                required
                                min="0"
                                step="10"
                                className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                value={projectData.budget}
                                onChange={(e) => setProjectData({ ...projectData, budget: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label htmlFor="timeline" className="block text-sm font-medium text-gray-400">
                                Timeline (in days)
                            </label>
                            <input
                                type="number"
                                id="timeline"
                                required
                                min="1"
                                className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                value={projectData.timeline}
                                onChange={(e) => setProjectData({ ...projectData, timeline: parseInt(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label htmlFor="developers" className="block text-sm font-medium text-gray-400">
                                Required Developers
                            </label>
                            <input
                                type="number"
                                id="developers"
                                required
                                min="1"
                                className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                value={projectData.required_developers}
                                onChange={(e) => setProjectData({ ...projectData, required_developers: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-6 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating Project...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>

                <div
                    className="bg-gray-800 border border-gray-700 p-6 rounded-xl text-center hover:shadow-2xl transition"
                >
                    <h2 className="text-2xl font-semibold mb-4">Skills Required</h2>

                    {/* Add Skill Section */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Skill name"
                                    className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                    value={currentSkill.name}
                                    onChange={(e) => setCurrentSkill({
                                        ...currentSkill,
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div className="w-32">
                                <select
                                    className="mt-2 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                    value={currentSkill.proficiency}
                                    onChange={(e) => setCurrentSkill({
                                        ...currentSkill,
                                        proficiency: e.target.value as Skill["proficiency"]
                                    })}
                                >
                                    <option className="bg-gray-900" value="Beginner">Beginner</option>
                                    <option className="bg-gray-900" value="Intermediate">Intermediate</option>
                                    <option className="bg-gray-900" value="Advanced">Advanced</option>
                                    <option className="bg-gray-900" value="Expert">Expert</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                Add
                            </button>
                        </div>

                        {/* Skills List */}
                        <div className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {projectData.skills.map((skill, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-sm hover:bg-gray-600"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-gray-200">{skill.name}</span>
                                            <span className="text-sm text-gray-400">
                                                {skill.proficiency}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
