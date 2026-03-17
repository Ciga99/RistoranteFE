import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import { ArrowLeft } from "lucide-react";
import HeaderFrom from "../../components/adminComponent/HeaderForm";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;

const emptyForm = {
  name: "",
  type: "primo" as DishType["type"],
  description: "",
  price: "",
  is_active: true,
};

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminDishFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchDish = async () => {
      try {
        const res = await api.get(`api/dishes/${id}/`);
        const d = res.data;
        setForm({ name: d.name, type: d.type, description: d.description, price: d.price, is_active: d.is_active });
      } catch (err) {
        console.error("Errore nel caricare il piatto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`api/dishes/${id}/`, form);
      } else {
        await api.post("api/dishes/", form);
      }
      navigate("/admin/dish-admin");
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6 max-w-xl">
      <HeaderFrom title = {isEdit ? "Modifica Piatto" : "Aggiungi Piatto"} navigateUrl="/admin/dish-admin"/>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Es. Tagliatelle al ragù" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
            {DISH_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={2} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
          <input name="price" value={form.price} onChange={handleChange} className={inputCls} placeholder="Es. 12.50" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          <span className="text-sm text-gray-700">Attivo</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/admin/dish-admin")}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}
