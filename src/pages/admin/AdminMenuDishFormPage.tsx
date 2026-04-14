import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import HeaderFrom from "../../components/adminComponent/HeaderForm";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;

const emptyForm = {
  name: "",
  type: "primo" as DishType["type"],
  description: "",
  price: "",
  is_active: true,
  show_on_menu: true,
};

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminMenuDishFormPage() {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
      await api.post(`api/menu/${menuId}/dishes/`, form);
      navigate(`/admin/menu-admin/${menuId}`);
    } catch (err) {
      console.error("Errore nell'aggiungere il piatto", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <HeaderFrom title = "Modifica Menu" navigateUrl="/admin/menu-admin/${menuId}"/>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Es. Tagliatelle al ragù" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
            {DISH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="show_on_menu" checked={form.show_on_menu} onChange={handleChange} />
          <span className="text-sm text-gray-700">Mostra nel menu</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(`/admin/menu-admin/${menuId}`)}
            className="px-4 py-2 rounded border border-gray-300  text-white hover:bg-gray-50"
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
