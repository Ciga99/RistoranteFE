import { useState } from "react";
import { Menu, X } from 'lucide-react';
import NavLinks from "./NavLInks";
import { useNavigate } from "react-router";

interface NavBarProps {
  title?: string;                          // default: "Mia Romagna"
  navLinks: { name: string; path: string }[];  // passati a NavLinks
  sideNavOnly?: boolean;                   // default: false
}

function NavBar({title="mia Romagna", navLinks, sideNavOnly = false}: NavBarProps) {
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
                    <span className="font-bold  tracking-wide text-amber-700" style={{ fontFamily: "'Playfair Display', serif" }}>{title} </span>
                    <X className="cursor-pointer text-gray-600 hover:text-gray-900" onClick={close} aria-label="Chiudi menu" />
                </div>
                <NavLinks
                    links = {navLinks}
                    className="flex flex-col"
                    classLink=" hover:bg-amber-500 text-gray-800 hover:text-gray-900 font-medium transition-colors p-4 border-b"
                    onClose={close}
                />
            </div>
            <h1
                className="text-2xl font-bold  tracking-wide text-amber-700 cursor-pointer flex-1 ml-4 md:ml-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
                onClick={() => { sideNavOnly ? navigate("/admin") : navigate("/")}}
                >
                {title}
            </h1>
            {!sideNavOnly && (
                <NavLinks  links = {navLinks} className="text-gray-800 hidden md:flex gap-6 text" classLink="relative pb-1 border-b-2 border-transparent hover:border-amber-500 text-gray-800 hover:text-gray-900 font-medium transition-colors" />
            )}
        </nav>
        </>
    );
}

export default NavBar;
