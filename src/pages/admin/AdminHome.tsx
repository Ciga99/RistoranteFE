import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function AdminLayout(){
    return (
    <>
    <NavBar title='Mia Romagna admin' sideNavOnly={true}  navLinks={[{ name: "Menu", path: "/" },{ name: "Piatti", path: "/menu" },{ name: "Stanze", path: "/rooms" }, { name: "Calendario Prenotazioni", path: "/rooms" }]} />
    <Outlet/>
    </>
    )
}