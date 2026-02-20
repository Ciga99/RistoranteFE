interface NavLinksProps {
  className?: string;
}
function NavLinks({ className }: NavLinksProps) {
    const navLinks = [  
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
        { name: "Stanze", path: "/rooms" },
        { name: "About", path: "/about" },
    ];

    return (
    <>
    <ul className={className}>
        {navLinks.map((link) => (
            <li key={link.path}>
                <a
                    href={link.path}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    {link.name}
                </a>
            </li>
        ))}
    </ul>
    </>);
}
export default NavLinks;