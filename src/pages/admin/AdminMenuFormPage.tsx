import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Plus, Trash2 } from "lucide-react";
import AdminFormCard, { inputCls } from "../../components/adminComponent/AdminFormCard";
import type { DishType } from "../../types/menu";
import FormSelect from "../../components/adminComponent/FormSelect";
import FormToggle from "../../components/adminComponent/FormToggle";
import Spinner from "../../components/Spinner";

const DAY_STR_TO_NUM: Record<string, number> = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
};
const DAY_NUM_TO_STR: Record<number, string> = {
  0: "monday", 1: "tuesday", 2: "wednesday", 3: "thursday", 4: "friday", 5: "saturday", 6: "sunday",
};

const emptyForm = {
  type: "menu_card" as "menu_card" | "daily_menu",
  notes: "",
  date: "",
  day_of_week: "",
  is_active: true,
};

const DISH_CATEGORIES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;
type DishCategory = typeof DISH_CATEGORIES[number];
type DishCategoryOrAll = DishCategory | "all";
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
  const [selectedCategory, setSelectedCategory] = useState<DishCategoryOrAll>("primo");
  const [selectedDishIds, setSelectedDishIds] = useState<Set<number>>(new Set());

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
          day_of_week: m.day_of_week != null ? (DAY_NUM_TO_STR[m.day_of_week] ?? "") : "",
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
    api.get("api/dishes/?active=true").then(res => setAllDishes(res.data)).catch(console.error);
  }, []);

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
      const payload = {
        ...form,
        date: form.date || null,
        day_of_week: form.day_of_week ? DAY_STR_TO_NUM[form.day_of_week] ?? null : null,
        dish_ids: menuDishes.map(d => d.id),
      };
      if (isEdit) {
        await api.put(`api/menu/${id}/`, payload);
      } else {
        await api.post("api/menu/", payload);
      }
      navigate("/admin/menu-admin");
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDish = () => {
    if (selectedDishIds.size === 0) return;
    const dishes = allDishes.filter(d => selectedDishIds.has(d.id));
    setMenuDishes(prev => [...prev, ...dishes.filter(d => !prev.some(p => p.id === d.id))]);
    setSelectedDishIds(new Set());
  };

  const handleRemoveDish = (dish: DishType) => {
    if (!confirm(`Rimuovere "${dish.name}" dal menu?`)) return;
    setMenuDishes(prev => prev.filter(d => d.id !== dish.id));
  };

  const dishesByCategory = DISH_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = menuDishes.filter(d => d.type === cat);
    return acc;
  }, {} as Record<DishCategory, DishType[]>);

  const availableForCategory = allDishes.filter(d =>
    (selectedCategory === "all" || d.type === selectedCategory) &&
    !menuDishes.some(m => m.id === d.id)
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

      <div> 
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Aggiungi note sul menu..."
          className={inputCls}
        />
      </div>

      <FormToggle label="Attivo" name="is_active" checked={form.is_active} onChange={handleChange} />

      {/* Sezione piatti */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <h3 className="text-lg font-bold text-amber-700 mb-3">Piatti nel Menu</h3>
          <div className="flex flex-col gap-6">
            {/* Pannello 1 — selezione categoria + piatto */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-amber-700">Aggiungi un piatto</p>

              <div className="flex flex-wrap gap-2">
                <button
                  key="all"
                  type="button"
                  onClick={() => { setSelectedCategory("all"); setSelectedDishIds(new Set()); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                    ${selectedCategory === "all"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"}`}
                >
                  Tutte
                </button>
                {DISH_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setSelectedDishIds(new Set()); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                      ${selectedCategory === cat
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"}`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {availableForCategory.length > 0 ? (
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
                  {availableForCategory.map(d => (
                    <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-amber-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={selectedDishIds.has(d.id)}
                        onChange={e => {
                          setSelectedDishIds(prev => {
                            const next = new Set(prev);
                            e.target.checked ? next.add(d.id) : next.delete(d.id);
                            return next;
                          });
                        }}
                        className="accent-amber-600"
                      />
                      <span className="flex-1 text-black">{d.name}</span>
                      <span className="text-gray-400 text-xs">€ {d.price}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Nessun piatto disponibile (o tutti già aggiunti).</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDish}
                  disabled={selectedDishIds.size === 0}
                  className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:opacity-40"
                >
                  <Plus size={14} /> Aggiungi{selectedDishIds.size > 0 ? ` (${selectedDishIds.size})` : ""}
                </button>
              </div>

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
