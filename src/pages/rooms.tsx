import Hero from "../components/Hero";
import type { RoomType } from "../types/rooms";
import RoomCard from "../components/RoomCard";
import { useEffect, useState } from "react";
import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function Rooms() {
    const [arryOfRooms, setArryOfRooms] = useState<RoomType[]>([]);
    // const arryOfRooms: RoomType[] = [
    //     {
    //         id: 1,
    //         name: "Camera 1",
    //         description: "Descrizione della camera 1",
    //         beds: 2,
    //         priceNight: 100,
    //         listOfImages: ["https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXN8ZW58MHx8MHx8fDA%3D"]
    //     },
    //     {
    //         id: 2,
    //         name: "Camera 2",
    //         description: "Descrizione della camera 2",
    //         beds: 1,
    //         priceNight: 80,
    //         listOfImages: [
    //             "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
    //             "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
    //         ],
    //     },
    //     {
    //         id: 3,
    //         name: "Camera 3",
    //         description: "Descrizione della camera 3",
    //         beds: 3,
    //         priceNight: 150,
    //         listOfImages: [
    //             "https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=800&auto=format&fit=crop&q=80",
    //             "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
    //             "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
    //         ],
    //     }
    // ];
    useEffect(() => {
        api.get("api/rooms").then((res) => setArryOfRooms(res.data))
    }, []);
    
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <Hero 
            inputH={50} 
            srcImg="https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            altIMg="La Mia Romagna" title="Le nostre camere" 
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