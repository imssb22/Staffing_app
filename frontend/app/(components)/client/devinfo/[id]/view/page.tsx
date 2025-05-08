'use client'
import { useParams } from "next/navigation";
import { useState , useEffect} from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../public/store';
import axios from "axios";
import dotenv from "dotenv";
import Loading from "@/app/(components)/loading/loading";
dotenv.config();
interface Developer {
    id : string
    name: string,
    YOE: number,
    email: string,
    phone: string,
    password: string,
    hrate : number,
    rating: number
}

export default function DevInfo() {
    const [info, setInfo] = useState<Developer>()
    const id = useParams().id as string
    const [loading, setLoading] = useState(true)
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if(!token)return;
   
        const devInfo = async() => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/devinfo/${id}`)
            if(res.status === 200){
                setInfo(res.data)
                setLoading(false)
            }
        }
        devInfo();
    }, [token, id])

    if (loading) {
        <Loading></Loading>
    }

    if (!info) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Developer info not found.
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">{info.name}</h2>
                <div className="space-y-3 text-gray-200">
                    <div>
                        <span className="font-semibold text-cyan-300">Years of Experience:</span> {info.YOE}
                    </div>
                    <div>
                        <span className="font-semibold text-cyan-300">Email:</span> {info.email}
                    </div>
                    <div>
                        <span className="font-semibold text-cyan-300">Phone:</span> {info.phone}
                    </div>
                    <div>
                        <span className="font-semibold text-cyan-300">Hourly Rate:</span> ${info.hrate}
                    </div>
                    <div>
                        <span className="font-semibold text-cyan-300">Rating:</span> {info.rating}
                    </div>
                </div>
            </div>
        </div>
    )
}