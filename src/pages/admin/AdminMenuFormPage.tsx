import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ArrowLeft } from "lucide-react";
import HeaderFrom from "../../components/adminComponent/HeaderForm";

const emptyForm = {
  type: "menu_card" as "menu_card" | "daily_menu",
  notes: "",
  date: "",
  day_of_week: "",
  is_active: true,
};

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminMenuFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchMenu = async () => {
      try {
        const res = await api.get(`api/menu/${id}/`);
        const m = res.data;
        setForm({
          type: m.type,
          notes: m.notes ?? "",
          date: m.date ?? "",
          day_of_week: m.day_of_week?.toString() ?? "",
          is_active: m.is_active,
        });
      } catch (err) {
        console.error("Errore nel caricare il menu", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
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
        await api.put(`api/menu/${id}/`, form);
      } else {
        await api.post("api/menu/", form);
      }
      navigate("/admin/menu-admin");
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      <HeaderFrom title =  {isEdit ? "Modifica Menu" : "Aggiungi Menu"} navigateUrl="/admin/menu-admin"/>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
            <option value="menu_card">Carta</option>
            <option value="daily_menu">Menu del giorno</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className={inputCls} rows={3} />
        </div>

        {form.type === "daily_menu" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giorno della settimana</label>
                <select name="type" value={form.day_of_week || ""} onChange={handleChange} className={inputCls}>
                  <option value="">Seleziona un giorno...</option>
                  <option value="monday">Lunedì</option>
                  <option value="tuesday">Martedì</option>
                  <option value="wednesday">Mercoledì</option>
                  <option value="thursday">Giovedì</option>
                  <option value="friday">Venerdì</option>
                  <option value="saturday">Sabato</option>
                  <option value="sunday">Domenica</option>
                </select>
            </div>
          </>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          <span className="text-sm text-gray-700">Attivo</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/admin/menu-admin")}
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
