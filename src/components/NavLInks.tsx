import { Link } from "react-router-dom";

interface NavLinksProps {
  className?: string;
  classLink?: string;
  onClose?: () => void;
  links:  { name: string; path: string }[];
}
function NavLinks({ className, classLink, onClose, links }: NavLinksProps) {
    // const navLinks = [
    //     { name: "Home", path: "/" },
    //     { name: "Menu", path: "/menu" },
    //     { name: "Stanze", path: "/rooms" },
    // ];

    return (
    <ul className={className}>
        {links.map((link) => (
            <Link to={link.path} key={link.path} className={classLink} onClick={onClose}>
                {link.name}
            </Link>
        ))}
    </ul>);
}
export default NavLinks;
