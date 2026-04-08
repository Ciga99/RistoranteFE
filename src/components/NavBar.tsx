import { useState } from "react";
import { Menu, X } from 'lucide-react';
import NavLinks from "./NavLInks";
import { useNavigate } from "react-router";

interface NavBarProps {
  title?: string;                          // default: "La Mia Romagna"
  navLinks?: { name: string; path: string }[];  // passati a NavLinks
  sideNavOnly?: boolean;                   // default: false
}

function NavBar({title="La Mia Romagna", navLinks, sideNavOnly = false}: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const close = () => setIsOpen(false);

    return (
        <>
        <nav className="flex items-center px-6 py-4 bg-white shadow-sm w-full relative z-10">
            <Menu
                className={sideNavOnly ? "cursor-pointer text-gray-700" :  "md:hidden text-gray-700 cursor-pointer"}
                onClick={() => setIsOpen(true)}
                aria-label="Apri menu"
            />

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={close}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="text-base font-bold tracking-wide text-amber-700" style={{ fontFamily: "'Playfair Display', serif" }}>{title} </span>
                    <X className="cursor-pointer text-gray-600 hover:text-gray-900" onClick={close} aria-label="Chiudi menu" />
                </div>
                <NavLinks
                    links = {navLinks}
                    className="flex flex-col"
                    classLink="
                    text-gray-800 hover:text-gray-900 font-medium p-4 border-b
                    relative overflow-hidden
                    after:content-['']
                    after:absolute after:top-0 after:left-0
                    after:h-full after:w-0
                    after:-z-10
                    after:bg-amber-400
                    after:transition-all after:duration-300 after:ease-in-out
                    hover:after:w-full
                    "
                    onClose={close}
                />
            </div>
            <p
                className="text-2xl font-bold tracking-wide text-amber-700 cursor-pointer flex-1 ml-4 md:ml-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
                onClick={() => { sideNavOnly ? navigate("/admin") : navigate("/")}}
                >
                {title} 
            </p>
            {!sideNavOnly && (
                <NavLinks  links = {navLinks} 
                    className="text-gray-800 hidden md:flex gap-6 text" 
                    classLink="  
                                relative
                                text-gray-800 
                                hover:text-gray-900 font-medium
                                pb-1
                                after:content-[''] 
                                after:absolute 
                                after:left-0 
                                after:bottom-0
                                after:h-[2px] 
                                after:w-0 
                                after:bg-amber-500
                                after:transition-all after:duration-500 
                                after:ease-in-out
                                hover:after:w-full
                            "
                />
            )}
        </nav>
        </>
    );
}

export default NavBar;
