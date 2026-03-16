import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function AdminLayout(){
    return (
    <>
    <NavBar title='Mia Romagna admin' sideNavOnly={true}  navLinks={[{ name: "Menu", path: "/menu-admin" },{ name: "Piatti", path: "/menu-admin" },{ name: "Stanze", path: "/menu-admin" }, { name: "Calendario Prenotazioni", path: "/calendar-admin" }]} />
    <Outlet/>
    </>
    )
}