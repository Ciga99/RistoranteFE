import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { MenuType, DishType } from "../../types/menu";
import { AdminModal } from "../../components/adminComponent/AdminModal";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;

const emptyDishForm = {
  name: "",
  type: "primo" as DishType["type"],
  description: "",
  price: "",
  is_active: true,
};

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminMenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<MenuType | null>(null);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [menuForm, setMenuForm] = useState({ type: "menu_card" as MenuType["type"], notes: "", date: "", is_active: true });

  const [addDishModalOpen, setAddDishModalOpen] = useState(false);
  const [dishForm, setDishForm] = useState(emptyDishForm);

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

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMenuForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDishForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const openEditMenu = () => {
    if (!menu) return;
    setMenuForm({ type: menu.type, notes: menu.notes ?? "", date: menu.date ?? "", is_active: menu.is_active });
    setEditModalOpen(true);
  };

  const saveMenu = async () => {
    try {
      await api.put(`api/menu/${id}/`, menuForm);
      setEditModalOpen(false);
      fetchMenu();
    } catch (err) {
      console.error("Errore nel salvare il menu", err);
    }
  };

  const saveDish = async () => {
    try {
      await api.post(`api/menu/${id}/dishes/`, dishForm);
      setAddDishModalOpen(false);
      setDishForm(emptyDishForm);
      fetchMenu();
    } catch (err) {
      console.error("Errore nell'aggiungere il piatto", err);
    }
  };

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

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;
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
            {menu.date && <p className="text-sm text-gray-400 mt-1">Data: {menu.date}</p>}
            <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${
              menu.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>
              {menu.is_active ? "Attivo" : "Non attivo"}
            </span>
          </div>
          <button
            onClick={openEditMenu}
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
          onClick={() => { setDishForm(emptyDishForm); setAddDishModalOpen(true); }}
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

      {/* Modal modifica info menu */}
      {editModalOpen && (
        <AdminModal
          title="Modifica info Menu"
          onClose={() => setEditModalOpen(false)}
          onSave={saveMenu}
        >
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select name="type" value={menuForm.type} onChange={handleMenuChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900">
            <option value="menu_card">Carta</option>
            <option value="daily_menu">Menu del giorno</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Note</label>
          <textarea name="notes" value={menuForm.notes} onChange={handleMenuChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900" rows={3} />

          {menuForm.type === "daily_menu" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-2">Data</label>
              <input type="date" name="date" value={menuForm.date} onChange={handleMenuChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900" />
            </>
          )}

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={menuForm.is_active} onChange={handleMenuChange} />
            <span className="text-sm text-gray-700">Attivo</span>
          </label>
        </AdminModal>
      )}

      {/* Modal aggiunta piatto */}
      {addDishModalOpen && (
        <AdminModal
          title="Aggiungi Piatto al Menu"
          onClose={() => setAddDishModalOpen(false)}
          onSave={saveDish}
        >
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input name="name" value={dishForm.name} onChange={handleDishChange} className={inputCls} placeholder="Es. Tagliatelle al ragù" />

          <label className="block text-sm font-medium text-gray-700 mt-2">Tipo</label>
          <select name="type" value={dishForm.type} onChange={handleDishChange} className={inputCls}>
            {DISH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Descrizione</label>
          <textarea name="description" value={dishForm.description} onChange={handleDishChange} className={inputCls} rows={2} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Prezzo (€)</label>
          <input name="price" value={dishForm.price} onChange={handleDishChange} className={inputCls} placeholder="Es. 12.50" />

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={dishForm.is_active} onChange={handleDishChange} />
            <span className="text-sm text-gray-700">Attivo</span>
          </label>
        </AdminModal>
      )}
    </div>
  );
}
