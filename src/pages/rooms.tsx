import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Card from "../components/Card";
import Hero from "../components/Hero";
import type { RoomType } from "../types/rooms";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
    const arryOfRooms: RoomType[] = [
        {
            id: 1,
            name: "Camera 1",
            description: "Descrizione della camera 1",
            beds: 2,
            priceNight: 100,
            listOfImages: ["https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXN8ZW58MHx8MHx8fDA%3D"]
        },
        {
            id: 2,
            name: "Camera 2",
            description: "Descrizione della camera 2",
            beds: 1,
            priceNight: 80,
            listOfImages: [
                "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
            ],
        },
        {
            id: 3,
            name: "Camera 3",
            description: "Descrizione della camera 3",
            beds: 3,
            priceNight: 150,
            listOfImages: [
                "https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
            ],
        }
    ];

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <Hero inputH={50} 
            srcImg="https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            altIMg="Mia Romagna" title="Le nostre camere" 
            description="Scopri le nostre camere accoglienti e confortevoli, perfette per un soggiorno indimenticabile nella splendida campagna trevigiana. Ogni camera è arredata con cura e dotata di tutti i comfort necessari per rendere il tuo soggiorno piacevole e rilassante." 
            />
            <div className="m-8 flex flex-col gap-4">
                {arryOfRooms.map((room, index) => (
                    <div key={room.id}>
                        <RoomCard room={room} />
                        {/* <Card>
                            <div className="flex flex-col sm:flex-row cursor-pointer gap-4">
                                <div className="relative flex items-center justify-center group">
                                    <ArrowBigLeft className="text-black absolute left-0 z-10 p-1 bg-white/50 rounded-full hover:bg-white transition-colors" />
                                    <img className="h-56 w-full sm:h-48 sm:w-64 lg:h-64 lg:w-80 xl:h-72 xl:w-96 object-cover rounded-md flex-shrink-0" src={room.listOfImages[0]} alt={room.name} />
                                    <ArrowBigRight className="text-black absolute right-0 z-10 p-1 bg-white/50 rounded-full hover:bg-white transition-colors"/>
                                </div> 
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-bold text-gray-700">{room.name}</h2>
                                    <p className="text-gray-500 text-sm">Posti: {room.beds} &nbsp;·&nbsp; {room.priceNight}€ / notte</p>
                                    <p className="text-gray-600">{room.description}</p>
                                </div>
                            </div>
                        </Card> */}
                    </div>
                ))}
            </div>
        </div>
    );
}