import { ChevronRight, ChevronLeft} from "lucide-react";
import Card from "./Card";
import type { RoomType } from "../types/rooms";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = (import.meta.env.VITE_API_URL as string).replace(/\/$/, "");
function imgUrl(path: string) {
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

export default function RoomCard({room}: {room: RoomType}) {
    const [currentIndexImg, setCurrentIndexImg] = useState(0);
    const navigate = useNavigate();

    function handleNextImg(e: React.MouseEvent) {
        e.stopPropagation(); // Evita di attivare click sulla Card se presente
        setCurrentIndexImg(prev => (prev < room.images.length - 1 ? prev + 1 : 0));
    }
    function handlePrevImg(e: React.MouseEvent) {
        e.stopPropagation();
        setCurrentIndexImg(prev => (prev > 0 ? prev - 1 : room.images.length - 1));
    }

    return(
        <Card>
            <div className="flex flex-col sm:flex-row cursor-pointer gap-4" onClick={() => navigate(`/rooms/${room.id}`)}>
                <div className="relative flex items-center justify-center group">
                    {/* {room.images.length > 1 && <ArrowBigLeft className="text-black absolute left-0 z-10 p-1 bg-white/50 rounded-full hover:bg-white transition-colors" onClick={handlePrevImg} />} */}
                    {room.images.length > 1 &&                                 
                        <>
                            <button
                                onClick={handlePrevImg}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                            >
                            <ChevronLeft size={20} />
                            </button>
                        </>
                        }                    
                    <img className="h-56 w-full sm:h-48 sm:w-64 lg:h-64 lg:w-80 xl:h-72 xl:w-96 object-cover rounded-md flex-shrink-0" src={imgUrl(room.images[currentIndexImg].image)} alt={room.name} />
                    {/* {room.images.length > 1 && <ArrowBigRight className="text-black absolute right-0 z-10 p-1 bg-white/50 rounded-full hover:bg-white transition-colors" onClick={handleNextImg}/>} */}
                    {room.images.length > 1 &&                                 
                        <>
                            <button
                                onClick={handleNextImg}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                            >
                            <ChevronRight size={20} />
                            </button>
                        </>
                        }                    
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-gray-700">{room.name}</h2>
                    <p className="text-gray-500 text-sm">Posti: {room.capacity} &nbsp;·&nbsp; {room.price_per_night}€ / notte</p>
                    <p className="text-gray-600">{room.description}</p>
                </div>
            </div>
        </Card>
    );
}