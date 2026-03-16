import { Link } from "react-router-dom";

const DEFAULT_LINKS = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Stanze", path: "/rooms" },
];

interface NavLinksProps {
  className?: string;
  classLink?: string;
  onClose?: () => void;
  links?: { name: string; path: string }[];
}

function NavLinks({ className, classLink, onClose, links }: NavLinksProps) {
    const resolvedLinks = links ?? DEFAULT_LINKS;

    return (
    <ul className={className}>
        {resolvedLinks.map((link) => (
            <Link to={link.path} key={link.path} className={classLink} onClick={onClose}>
                {link.name}
            </Link>
        ))}
    </ul>);
}

export default NavLinks;
