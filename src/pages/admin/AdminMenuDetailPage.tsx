import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { MenuType, DishType } from "../../types/menu";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import Spinner from "../../components/Spinner";

export default function AdminMenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<MenuType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/menu/${id}/`);
      setMenu(res.data);
    } catch (err) {
      console.error("Errore nel caricare il menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, [id]);

  const removeDish = async (dish: DishType) => {
    if (!confirm(`Rimuovere "${dish.name}" dal menu?`)) return;
    try {
      await api.delete(`api/menu/${id}/dishes/${dish.id}/`);
      fetchMenu();
    } catch (err) {
      console.error("Errore nella rimozione", err);
    }
  };

  const dishColumns = [
    {
      header: "Nome",
      render: (d: DishType) => <span className="font-medium text-gray-800">{d.name}</span>,
    },
    {
      header: "Tipo",
      render: (d: DishType) => (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 capitalize">
          {d.type}
        </span>
      ),
    },
    {
      header: "Prezzo",
      render: (d: DishType) => <span className="font-bold text-amber-600">€ {d.price}</span>,
    },
    {
      header: "Stato",
      render: (d: DishType) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${d.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {d.is_active ? "Attivo" : "Non attivo"}
        </span>
      ),
    },
  ];

  if (loading) return <Spinner />;
  if (!menu) return <p className="p-8 text-center text-red-500">Menu non trovato</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/admin/menu-admin")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={16} /> Torna alla lista
      </button>

      {/* Info menu */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              menu.type === "daily_menu" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}>
              {menu.type === "daily_menu" ? "Menu del giorno" : "Carta"}
            </span>
            <p className="mt-3 text-gray-700">{menu.notes || "Nessuna nota"}</p>
            <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${
              menu.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>
              {menu.is_active ? "Attivo" : "Non attivo"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/admin/menu-admin/${id}/edit`)}
            className="flex items-center gap-2 text-sm text-amber-600 border border-amber-300 px-3 py-1.5 rounded hover:bg-amber-50"
          >
            <Pencil size={14} /> Modifica info
          </button>
        </div>
      </div>

      {/* Piatti del menu */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-700">
          Piatti in questo menu ({menu.dishes?.length ?? 0})
        </h2>
        <button
          onClick={() => navigate(`/admin/menu-admin/${id}/add-dish`)}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus size={18} /> Aggiungi Piatto
        </button>
      </div>

      <AdminTable
        columns={dishColumns}
        data={menu.dishes ?? []}
        onEdit={() => {}}
        onDelete={removeDish}
      />
    </div>
  );
}
