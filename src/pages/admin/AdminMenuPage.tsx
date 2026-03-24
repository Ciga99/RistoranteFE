import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { Plus } from "lucide-react";
import type { MenuType } from "../../types/menu";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import Spinner from "../../components/Spinner";
import FormToggle from "../../components/adminComponent/FormToggle";

const selectCls = "border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white";

const DAY_LABELS: Record<number, string> = {
  0: "Lunedì", 1: "Martedì", 2: "Mercoledì", 3: "Giovedì", 4: "Venerdì", 5: "Sabato", 6: "Domenica",
};

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [filterType, setFilterType] = useState<"all" | "daily_menu" | "menu_card">("all");

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

  const filteredMenus = useMemo(() => {
    return menus
      .filter(m => filterActive === "all" ? true : filterActive === "active" ? m.is_active : !m.is_active)
      .filter(m => filterType === "all" ? true : m.type === filterType);
  }, [menus, filterActive, filterType]);

  const handleDelete = async (menu: MenuType) => {
    if (!confirm("Sicuro di voler eliminare questo menu?")) return;
    try {
      await api.delete(`api/menu/${menu.id}/`);
      fetchMenus();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const handleToggleActive = async (menu: MenuType) => {
    try {
      await api.patch(`api/menu/${menu.id}/`, { is_active: !menu.is_active });
      fetchMenus();
    } catch (err) {
      console.error("Errore nel cambiare lo stato", err);
    }
  };

  const columns = useMemo(() => [
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
    ...(filterType !== "menu_card" ? [{
      header: "Giorno",
      render: (m: MenuType) => (
        <span className="text-gray-600">
          {m.day_of_week != null ? (DAY_LABELS[m.day_of_week] ?? "—") : "—"}
        </span>
      ),
    }] : []),
    {
      header: "N° Piatti",
      render: (m: MenuType) => <span className="text-gray-600">{m.dishes?.length ?? 0}</span>,
    },
    {
      header: "Stato",
      render: (m: MenuType) => (
        <FormToggle
          label=""
          name="is_active"
          checked={m.is_active}
          onChange={() => handleToggleActive(m)}
        />
      ),
    },
  ], [filterType]);

  if (loading) return <Spinner />;

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
          onChange={e => setFilterType(e.target.value as "all" | "daily_menu" | "menu_card")}
          className={selectCls}
        >
          <option value="all">Tutti i tipi</option>
          <option value="daily_menu">Menu del giorno</option>
          <option value="menu_card">Carta</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={filteredMenus}
        onEdit={(m) => navigate(`/admin/menu-admin/${m.id}/edit`)}
        onDelete={handleDelete}
        onDetail={(m) => navigate(`/admin/menu-admin/${m.id}`)}
      />
    </div>
  );
}
