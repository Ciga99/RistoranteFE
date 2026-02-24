import { useState } from "react";
import MenuComponent from "../components/menuComponent/menucomponent";
import type { MenuType } from "../types/menu";
import { ArrowLeftRight } from "lucide-react";



export default function Menu() {
    const cardMenu : MenuType = {
        id: 1,
        name: "Menu Card",
        food: [
            {
                id: 1,
                type: "primo",
                name: "Pasta al pomodoro",
                description: "Pasta fresca con sugo di pomodoro e basilico",
                price: 8.50,
            },
            {
                id: 2, 
                type: "primo",
                name: "Risotto ai funghi",
                description: "Risotto cremoso con funghi porcini e parmigiano",
                price: 12.00,
            },
            {
                id: 3,  
                type: "secondo",
                name: "Pizza margherita",
                description: "Pizza classica con pomodoro, mozzarella e basilico",
                price: 10.00,
            },
        ],
    }
    const dailyMenu : MenuType = {
        id: 2,
        name: "Daily Menu",
        food: [
            {
                id: 1,
                type: "primo",
                name: "Zuppa del giorno",
                description: "Zuppa calda con ingredienti freschi di stagione",
                price: 6.00,
            },
            {
                id: 2,
                type: "contorno",
                name: "Insalata mista",
                description: "Insalata fresca con verdure di stagione e vinaigrette",
                price: 7.50,
            }
        ]
    }

    const [showCardMenu, setShowCardMenu] = useState(true);
    return (
        <>  
        <div className="relative h-[50dvh]">
            <img 
            src="https://images.unsplash.com/photo-1690983322857-0811d47fedfc?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Menu"
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-2 sm:mb-4">Menu</h1>
                <p className="text-xs sm:text-sm md:text-lg text-white/90 max-w-2xl leading-relaxed">

                </p>
            </div>
        </div>
        <div className="px-4 sm:px-8 pt-8 max-w-3xl mx-auto">
            <button onClick={() => setShowCardMenu(!showCardMenu)}>
                {showCardMenu ? "Mostra Menu Del Giorno" : "Mostra Menu Carta"}
                 <ArrowLeftRight className="ml-2 inline-block" />
            </button>
        </div>
        {showCardMenu ? <MenuComponent menu={cardMenu} /> : <MenuComponent menu={dailyMenu} />}
        </>
    );
}