import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import FormToggle from "../../components/adminComponent/FormToggle";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;
const selectCls = "border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white";

export default function AdminDishPage() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [filterType, setFilterType] = useState<"all" | DishType["type"]>("all");

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

  const handleToggleActive = async (dish: DishType) => {
    try {
      await api.patch(`api/dishes/${dish.id}/`, { is_active: !dish.is_active });
      fetchDishes();
    } catch (err) {
      console.error("Errore nel cambiare lo stato", err);
    }
  };

  const filteredDishes = useMemo(() => {
    return dishes
      .filter(d => filterActive === "all" ? true : filterActive === "active" ? d.is_active : !d.is_active)
      .filter(d => filterType === "all" ? true : d.type === filterType);
  }, [dishes, filterActive, filterType]);

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
        <FormToggle
          label=""
          name="is_active"
          checked={d.is_active}
          onChange={() => handleToggleActive(d)}
        />
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

      <div className="flex gap-3 mb-4">
        <select
          value={filterActive}
          onChange={e => setFilterActive(e.target.value as "all" | "active" | "inactive")}
          className={selectCls}
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivi</option>
          <option value="inactive">Non attivi</option>
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as "all" | DishType["type"])}
          className={selectCls}
        >
          <option value="all">Tutte le categorie</option>
          {DISH_TYPES.map(t => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={filteredDishes}
        onEdit={(d) => navigate(`/admin/dish-admin/${d.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}