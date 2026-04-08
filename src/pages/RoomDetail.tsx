import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight, Users, Moon } from "lucide-react";
import type { RoomType } from "../types/rooms";
import Spinner from "../components/Spinner";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
const BASE_URL = (import.meta.env.VITE_API_URL as string).replace(/\/$/, "");
function imgUrl(path: string) {
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<RoomType | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get(`api/room/${id}/`).then((res) => {
            setRoom(res.data);
        }).finally(() => setLoading(false));
    }, [id]);

    function handlePrev() {
        if (!room) return;
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : room.images.length - 1));
    }

    function handleNext() {
        if (!room) return;
        setCurrentIndex(prev => (prev < room.images.length - 1 ? prev + 1 : 0));
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    if (!room) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-gray-500">Stanza non trovata.</p>
                <button onClick={() => navigate("/rooms")} className="text-amber-700 underline">
                    Torna alle stanze
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Back button */}
            <button
                onClick={() => navigate("/rooms")}
                className="flex items-center gap-1 mb-6 transition-colors bg-white/80"
            >
                <ArrowLeft size={18} />
                <span className="text-sm">Torna alle stanze</span>
            </button>
            {/* Photo carousel */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-6">
                {room.images.length > 0 ? (
                    <>
                        <img
                            src={imgUrl(room.images[currentIndex].image)}
                            alt={room.name}
                            className="w-full h-72 sm:h-96 object-cover"
                        />
                        {room.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-72 flex items-center justify-center text-gray-400">
                        Nessuna immagine disponibile
                    </div>
                )}
            </div>

            {/* Room title & quick info */}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{room.name}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                <span className="flex items-center gap-1">
                    <Users size={15} />
                    {room.capacity} ospiti
                </span>
                <span className="flex items-center gap-1">
                    <Moon size={15} />
                    {room.price_per_night} € / notte
                </span>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Description */}
            {room.description && (
                <>
                    <p className="text-gray-600 leading-relaxed mb-6">{room.description}</p>
                    <hr className="border-gray-200 mb-6" />
                </>
            )}

            {/* Details */}
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Informazioni</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-amber-700 flex-shrink-0" />
                    <span>Capacità: <span className="font-medium text-gray-800">{room.capacity} ospiti</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <Moon size={16} className="text-amber-700 flex-shrink-0" />
                    <span>Prezzo per notte: <span className="font-medium text-gray-800">{room.price_per_night} €</span></span>
                </div>
            </div>
        </div>
    );
}
