import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Plus } from "lucide-react";
import type { MenuType } from "../../types/menu";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../../components/adminComponent/AdminTable";

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/menu/");
      setMenus(res.data);
    } catch (err) {
      console.error("Errore nel caricare i menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleDelete = async (menu: MenuType) => {
    if (!confirm("Sicuro di voler eliminare questo menu?")) return;
    try {
      await api.delete(`api/menu/${menu.id}/`);
      fetchMenus();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const columns = [
    {
      header: "Tipo",
      render: (m: MenuType) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          m.type === "daily_menu" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
        }`}>
          {m.type === "daily_menu" ? "Menu del giorno" : "Carta"}
        </span>
      ),
    },
    {
      header: "Note",
      render: (m: MenuType) => <span className="text-gray-700">{m.notes || "—"}</span>,
    },
    {
      header: "Data",
      render: (m: MenuType) => <span className="text-gray-600">{m.date || "—"}</span>,
    },
    {
      header: "N° Piatti",
      render: (m: MenuType) => <span className="text-gray-600">{m.dishes?.length ?? 0}</span>,
    },
    {
      header: "Stato",
      render: (m: MenuType) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          m.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
        }`}>
          {m.is_active ? "Attivo" : "Non attivo"}
        </span>
      ),
    },
  ];

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-700">Gestione Menu</h2>
        <button
          onClick={() => navigate("/admin/menu-admin/new")}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus size={18} /> Aggiungi Menu
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={menus}
        onEdit={(m) => navigate(`/admin/menu-admin/${m.id}/edit`)}
        onDelete={handleDelete}
        onDetail={(m) => navigate(`/admin/menu-admin/${m.id}`)}
      />
    </div>
  );
}
