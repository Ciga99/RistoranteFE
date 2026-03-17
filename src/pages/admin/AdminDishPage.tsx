import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function AdminDishPage() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/dishes/");
      setDishes(res.data);
    } catch (err) {
      console.error("Errore nel caricare i piatti", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const handleDelete = async (dish: DishType) => {
    if (!confirm("Sicuro di voler eliminare questo piatto?")) return;
    try {
      await api.delete(`api/dishes/${dish.id}/`);
      fetchDishes();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const columns = [
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
      header: "Descrizione",
      render: (d: DishType) => (
        <span className="text-gray-500 text-xs max-w-48 block truncate">{d.description || "—"}</span>
      ),
    },
    {
      header: "Prezzo",
      render: (d: DishType) => <span className="font-bold text-amber-600">€ {d.price}</span>,
    },
    {
      header: "Stato",
      render: (d: DishType) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          d.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
        }`}>
          {d.is_active ? "Attivo" : "Non attivo"}
        </span>
      ),
    },
  ];

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-700">Gestione Piatti</h2>
        <button
          onClick={() => navigate("/admin/dish-admin/new")}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus size={18} /> Aggiungi Piatto
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={dishes}
        onEdit={(d) => navigate(`/admin/dish-admin/${d.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
