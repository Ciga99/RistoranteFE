import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import { AdminModal } from "../../components/adminComponent/AdminModal";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { Plus } from "lucide-react";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;

const emptyForm = {
  name: "",
  type: "primo" as DishType["type"],
  description: "",
  price: "",
  is_active: true,
};

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminDishPage() {
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishType | null>(null);
  const [form, setForm] = useState(emptyForm);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editingDish) {
        await api.put(`api/dishes/${editingDish.id}/`, form);
      } else {
        await api.post("api/dishes/", form);
      }
      setModalOpen(false);
      fetchDishes();
    } catch (err) {
      console.error("Errore nel salvare", err);
    }
  };

  const handleDelete = async (dish: DishType) => {
    if (!confirm("Sicuro di voler eliminare questo piatto?")) return;
    try {
      await api.delete(`api/dishes/${dish.id}/`);
      fetchDishes();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const openEdit = (dish: DishType) => {
    setEditingDish(dish);
    setForm({ name: dish.name, type: dish.type, description: dish.description, price: dish.price, is_active: dish.is_active });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingDish(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  // Colonne per la tabella piatti
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
        <h1 className="text-2xl font-bold text-amber-700">Gestione Piatti</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">
          <Plus size={18} /> Aggiungi Piatto
        </button>
      </div>

      {/* Stessa AdminTable, colonne diverse */}
      <AdminTable
        columns={columns}
        data={dishes}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <AdminModal
          title={editingDish ? "Modifica Piatto" : "Aggiungi Piatto"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        >
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Es. Tagliatelle al ragù" />

          <label className="block text-sm font-medium text-gray-700 mt-2">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
            {DISH_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Descrizione</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={2} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Prezzo (€)</label>
          <input name="price" value={form.price} onChange={handleChange} className={inputCls} placeholder="Es. 12.50" />

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            <span className="text-sm text-gray-700">Attivo</span>
          </label>
        </AdminModal>
      )}
    </div>
  );
}