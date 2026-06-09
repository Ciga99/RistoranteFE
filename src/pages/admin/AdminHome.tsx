import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function AdminLayout(){
    return (
    <div style={{ fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
    <NavBar title='Ristorante Admin' 
    sideNavOnly={true} 
    navLinks={[
        { name: "Menu", path: "/admin/menu-admin" },
        { name: "Piatti", path: "/admin/dish-admin" },
        { name: "Stanze", path: "/admin/rooms-admin" }, 
        { name: "Orari", path: "/admin/hours-admin" }
        ]} />
    <Outlet/>
    </div>
    )
}