import { useEffect, useState } from "react";
import MenuComponent from "../components/menuComponent/menucomponent";
import type { MenuType } from "../types/menu";
import { ArrowLeftRight } from "lucide-react";
import Hero from "../components/Hero";
import { useParams } from "react-router-dom";
import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function Menu() {
    const { tipo } = useParams<{ tipo?: string }>();
    const [cardMenu, setMenu] = useState<MenuType[]>([]);
    const [specialMenu, setSpecialMenu] = useState<MenuType[]>([]);
    const [showCardMenu, setShowCardMenu] = useState(tipo !== "speciale");
    const [haveSpecialMenu, setHaveSpecialMenu] = useState(false);
    useEffect(() => {
        api.get("api/menu-card/").then((res : any) => setMenu(Array.isArray(res.data) ? res.data : [res.data]))
        api.get("api/special-menu/").then((res: any) =>
        {
            if(res.data.length > 0) {
                setSpecialMenu(Array.isArray(res.data) ? res.data : [res.data])
                setHaveSpecialMenu(true);
                setShowCardMenu(tipo !== "speciale");
            }else {
                setHaveSpecialMenu(false);
                setShowCardMenu(true);
                setSpecialMenu([]);
            }
        })
    }, [])
    return (
        <> 
        <Hero 
            inputH={50} 
            srcImg="https://images.unsplash.com/photo-1690983322857-0811d47fedfc?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            altIMg="Menu Ristorante" title="Il nostro menu" 
            description="Scopri i nostri piatti deliziosi, preparati con passione e ingredienti freschi. Scegli tra il nostro menu speciale o il menu alla carta, e lasciati conquistare dai sapori autentici della tradizione romagnola." />
        {haveSpecialMenu && (
        <div className="px-4 sm:px-8 pt-8 max-w-3xl mx-auto">
            <button onClick={() => setShowCardMenu(!showCardMenu)}>
                {showCardMenu ? "Mostra Menu Speciale" : "Mostra Menu Carta"}
                 <ArrowLeftRight className="ml-2 inline-block" />
            </button>
        </div>
        )}
        {showCardMenu
            ? cardMenu.map(m => <MenuComponent key={m.id} menu={m} />)
            : specialMenu.map(m => <MenuComponent key={m.id} menu={m} />)
        }   
        </>
    );
}
