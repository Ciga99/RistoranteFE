import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Plus, Trash2 } from "lucide-react";
import AdminFormCard, { inputCls } from "../../components/adminComponent/AdminFormCard";
import type { DishType } from "../../types/menu";
import FormSelect from "../../components/adminComponent/FormSelect";
import FormToggle from "../../components/adminComponent/FormToggle";
import Spinner from "../../components/Spinner";

const emptyForm = {
  type: "menu_card" as "menu_card" | "daily_menu",
  notes: "",
  date: "",
  day_of_week: "",
  is_active: true,
};

const DISH_CATEGORIES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;
type DishCategory = typeof DISH_CATEGORIES[number];
const CATEGORY_LABELS: Record<DishCategory, string> = {
  antipasto: "Antipasto",
  primo: "Primo",
  secondo: "Secondo",
  contorno: "Contorno",
  dolce: "Dolce",
  bevande: "Bevande",
};

export default function AdminMenuFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [allDishes, setAllDishes] = useState<DishType[]>([]);
  const [menuDishes, setMenuDishes] = useState<DishType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>("primo");
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [dishError, setDishError] = useState<string | null>(null);

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
        setMenuDishes(m.dishes ?? []);
      } catch (err) {
        console.error("Errore nel caricare il menu", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id, isEdit]);

  useEffect(() => {
    api.get("api/dishes/").then(res => setAllDishes(res.data)).catch(console.error);
  }, []);

  const fetchMenuDishes = async () => {
    const res = await api.get(`api/menu/${id}/`);
    setMenuDishes(res.data.dishes ?? []);
  };

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
        navigate("/admin/menu-admin");
      } else {
        const res = await api.post("api/menu/", form);
        const newId = res.data.id;
        for (const dish of menuDishes) {
          await api.post(`api/menu/${newId}/dishes/`, {
            name: dish.name,
            type: dish.type,
            description: dish.description,
            price: dish.price,
            is_active: dish.is_active,
          });
        }
        navigate("/admin/menu-admin");
      }
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDish = async () => {
    if (!selectedDishId) return;
    const dish = allDishes.find(d => d.id === selectedDishId);
    if (!dish) return;
    setDishError(null);
    if (isEdit) {
      try {
        await api.post(`api/menu/${id}/dishes/`, {
          name: dish.name,
          type: dish.type,
          description: dish.description,
          price: dish.price,
          is_active: dish.is_active,
        });
        await fetchMenuDishes();
        setSelectedDishId(null);
      } catch {
        setDishError("Impossibile aggiungere il piatto. Riprova.");
      }
    }else{
      //Nuvo Creazione 
      setMenuDishes(prev => [...prev, dish]);
      setSelectedDishId(null)
    }
  };

  const handleRemoveDish = async (dish: DishType) => {
    if (!confirm(`Rimuovere "${dish.name}" dal menu?`)) return;
    setDishError(null);
    if(isEdit){
      try {
        await api.delete(`api/menu/${id}/dishes/${dish.id}/`);
        await fetchMenuDishes();
      } catch {
        setDishError("Impossibile rimuovere il piatto.");
      }
    }else{
      setMenuDishes(prev =>  prev.filter(d => d.id !== dish.id));
    }
  };

  const dishesByCategory = DISH_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = menuDishes.filter(d => d.type === cat);
    return acc;
  }, {} as Record<DishCategory, DishType[]>);

  const availableForCategory = allDishes.filter(d =>
    d.type === selectedCategory && !menuDishes.some(m => m.name === d.name)
  );

  if (loading) return <Spinner />;

  return (
    <AdminFormCard
      title={isEdit ? "Modifica Menu" : "Aggiungi Menu"}
      backUrl="/admin/menu-admin"
      onSave={handleSave}
      saving={saving}
    >
      <FormSelect
        label="Tipo"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={[
          { value: "menu_card", label: "Carta" },
          { value: "daily_menu", label: "Menu del giorno" },
        ]}
      />
      <FormSelect
        label="Giorno della settimana"
        name="day_of_week"
        value={form.day_of_week || ""}
        onChange={handleChange}
        placeholder="Seleziona un giorno..."
        options={[
          { value: "monday", label: "Lunedì" },
          { value: "tuesday", label: "Martedì" },
          { value: "wednesday", label: "Mercoledì" },
          { value: "thursday", label: "Giovedì" },
          { value: "friday", label: "Venerdì" },
          { value: "saturday", label: "Sabato" },
          { value: "sunday", label: "Domenica" },
        ]}
      />
      {form.type === "daily_menu" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giorno della settimana</label>
            <select name="day_of_week" value={form.day_of_week || ""} onChange={handleChange} className={inputCls}>
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

      <FormToggle label="Attivo" name="is_active" checked={form.is_active} onChange={handleChange} />

      {/* Sezione piatti */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <h3 className="text-lg font-bold text-amber-700 mb-3">Piatti nel Menu</h3>
          <div className="flex flex-col gap-6">
            {/* Pannello 1 — selezione categoria + piatto */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-amber-700">Aggiungi un piatto</p>

              <div className="flex flex-wrap gap-2">
                {DISH_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setSelectedDishId(null); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                      ${selectedCategory === cat
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"}`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <select
                  value={selectedDishId ?? ""}
                  onChange={e => setSelectedDishId(Number(e.target.value) || null)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900 text-sm"
                >
                  <option value="">— Seleziona un piatto —</option>
                  {availableForCategory.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — € {d.price}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddDish}
                  disabled={!selectedDishId}
                  className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:opacity-40"
                >
                  <Plus size={14} /> Aggiungi
                </button>
              </div>

              {availableForCategory.length === 0 && (
                <p className="text-xs text-gray-400">Nessun piatto disponibile (o tutti già aggiunti).</p>
              )}
              {dishError && <p className="text-xs text-red-500">{dishError}</p>}
            </div>

            {/* Pannello 2 — piatti nel menu raggruppati per categoria */}
            <div className="flex flex-col gap-4">
              {DISH_CATEGORIES.map(cat => {
                const dishes = dishesByCategory[cat];
                if (!dishes.length) return null;
                return (
                  <div key={cat}>
                    <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wide mb-2">
                      {CATEGORY_LABELS[cat]}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {dishes.map(dish => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between bg-white border border-gray-100 rounded px-3 py-2"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">{dish.name}</span>
                            <span className="text-xs text-gray-400">€ {dish.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDish(dish)}
                            className="text-red-400 hover:text-red-600"
                            title="Rimuovi dal menu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {menuDishes.length === 0 && (
                <p className="text-sm text-gray-400 italic">Nessun piatto aggiunto al menu.</p>
              )}
            </div>
          </div>
      </div>
    </AdminFormCard>
  );
}
