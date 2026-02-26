import { useState } from "react";
import { Menu } from 'lucide-react';
import NavLinks from "./NavLInks";
import { useNavigate } from "react-router";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <>
        <nav className="flex items-center align-middle px-6 py-4 bg-white shadow-sm w-full relative z-10">              
            <Menu                    
                className="md:hidden text-gray-700 cursor-pointer"
                onClick={() => setIsOpen(true)}
                aria-label="Apri menu"/>
            {isOpen &&        
                <>
                    <div className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setIsOpen(false)}
                    /> 
                    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50">
                        <NavLinks className={`fixed flex flex-col top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}></NavLinks>
                    </div>
                </>
            }
            <h1 className="text-xl font-bold text-gray-800 cursor-pointer flex-1" onClick={() => navigate("/")}>Mia Romagna</h1>
            <NavLinks className="hidden md:flex gap-6"></NavLinks>
        </nav>
        </>
    );
}

export default NavBar;
