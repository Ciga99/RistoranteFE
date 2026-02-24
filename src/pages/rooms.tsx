import Card from "../components/Card";
import type { RoomType } from "../types/rooms";

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
            listOfImages: ["https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
        },
        {
            id: 3,
            name: "Camera 3",
            description: "Descrizione della camera 3",
            beds: 3,
            priceNight: 150,
            listOfImages: ["https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXN8ZW58MHx8MHx8fDA%3D"]
        },
        {
            id: 2,
            name: "Camera 1",
            description: "Descrizione della camera 1",
            beds: 2,
            priceNight: 100,
            listOfImages: ["https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXN8ZW58MHx8MHx8fDA%3D"]
        },
        {
            id: 3,
            name: "Camera 2",
            description: "Descrizione della camera 2",
            beds: 1,
            priceNight: 80,
            listOfImages: ["https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
        },
        {
            id: 4,
            name: "Camera 3",
            description: "Descrizione della camera 3",
            beds: 3,
            priceNight: 150,
            listOfImages: ["https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXN8ZW58MHx8MHx8fDA%3D"]
        }
    ];
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <div className="relative h-[50vh]">
                <img
                src="https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Mia Romagna"
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
                    Le nostre camere
                </h1>
                <p className="text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                    Un ristorante nel cuore della campagna trevigiana, per ogni tua occasione:
                    ricevimenti, battesimi, comunioni, cresime, feste di laurea, pranzi di lavoro o cene intime.
                </p>
                </div>
            </div>
            <div className=" m-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {arryOfRooms.map((room) => (
                    <div key={room.id} className="mb-8 ">
                        <Card>
                            <div className="cursor-pointer">
                                <img className="h-64 w-full object-contain " src={room.listOfImages[0]} alt={room.name}></img>
                                <h2 className="text-2xl font-bold mb-4 text-gray-600">{room.name}</h2>
                                <p className="text-gray-600">Posti {room.beds}  - costo a notte {room.priceNight}€</p>
                                <p className="text-gray-600">{room.description}</p>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}