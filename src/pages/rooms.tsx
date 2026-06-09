import Hero from "../components/Hero";
import type { RoomType } from "../types/rooms";
import RoomCard from "../components/RoomCard";
import { useEffect, useState } from "react";
import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function Rooms() {
    const [arryOfRooms, setArryOfRooms] = useState<RoomType[]>([]);
    useEffect(() => {
        api.get("api/rooms").then((res) => setArryOfRooms(res.data))
    }, []);
    
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <Hero 
            inputH={50} 
            srcImg="https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            altIMg="Ristorante" title="Le nostre camere" 
            description="Scopri le nostre camere accoglienti e confortevoli, perfette per un soggiorno indimenticabile nella splendida campagna trevigiana." 
            />
            <div className="m-8 flex flex-col gap-4">
                {arryOfRooms.map((room) => (
                    <div key={room.id}>
                        <RoomCard room={room} />
                    </div>
                ))}
            </div>
        </div>
    );
}