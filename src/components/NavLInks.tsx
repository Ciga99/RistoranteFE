import { Link } from "react-router-dom";

interface NavLinksProps {
  className?: string;
}
function NavLinks({ className }: NavLinksProps) {
    const navLinks = [  
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
        { name: "Stanze", path: "/rooms" },
    ];

    return (
    <>
    <ul className={className}>
        {navLinks.map((link) => (
            <Link to={link.path} key={link.path}>
                <a
                    href={link.path}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    {link.name}
                </a>
            </Link >
        ))}
    </ul>
    </>);
}
export default NavLinks;