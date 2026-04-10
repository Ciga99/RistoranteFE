import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Spinner from "../../components/Spinner";
import { api } from "../../services/api";
import type { OpeningHour, SpecialDay } from "../../types/hours";
import FormToggle from "../../components/adminComponent/FormToggle";
import { inputCls } from "../../components/adminComponent/AdminFormCard";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { AdminModal } from "../../components/adminComponent/AdminModal";

// id: 0 = non ancora salvato sul backend (sentinel per decidere POST vs PATCH)
export const DEFAULT_DAYS: OpeningHour[] = [
  { id: 0, day_of_week: 0, day_label: "Lunedì",    is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 1, day_label: "Martedì",   is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 2, day_label: "Mercoledì", is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 3, day_label: "Giovedì",   is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 4, day_label: "Venerdì",   is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 5, day_label: "Sabato",    is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
  { id: 0, day_of_week: 6, day_label: "Domenica",  is_open: true, lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null },
];

// ─── HourCard (componente controllato — nessuno stato proprio) ────────────────

interface HourCardProps {
  data: OpeningHour;
  onChange: (updated: OpeningHour) => void;
}

function HourCard({ data, onChange }: HourCardProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    onChange({//Avvisa il padre
      ...data,
      [name]: type === "checkbox" ? checked : value === "" ? null : value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col gap-4">
      {/* Header: nome giorno + toggle aperto/chiuso */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">{data.day_label}</h3>
        <FormToggle
          label={data.is_open ? "Aperto" : "Chiuso"}
          name="is_open"
          checked={data.is_open}
          onChange={handleChange}
        />
      </div>

      {/* Sezione Pranzo */}
      <div className={`flex flex-col gap-2 ${!data.is_open ? "opacity-40 pointer-events-none" : ""}`}>
        <p className="text-sm font-medium text-amber-700">Pranzo</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Apertura</label>
            <input type="time" name="lunch_open" value={data.lunch_open ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Chiusura</label>
            <input type="time" name="lunch_close" value={data.lunch_close ?? ""} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Sezione Cena */}
      <div className={`flex flex-col gap-2 ${!data.is_open ? "opacity-40 pointer-events-none" : ""}`}>
        <p className="text-sm font-medium text-amber-700">Cena</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Apertura</label>
            <input type="time" name="dinner_open" value={data.dinner_open ?? ""} onChange={handleChange} className={inputCls} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Chiusura</label>
            <input type="time" name="dinner_close" value={data.dinner_close ?? ""} onChange={handleChange} className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hour (pagina principale) ─────────────────────────────────────────────────

export default function Hour() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //Special Day 
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<SpecialDay | null>(null);
  const [showSpecialDays, setShowSpecialDays] = useState(false); // Toggle visualizzazione giorni speciali
    const EMPTY_SPECIAL: SpecialDay = {//Defaul 
        id: 0, name: "", is_show: true, is_open: true,
        lunch_open: null, lunch_close: null, dinner_open: null, dinner_close: null,
    };


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("api/opening-hours/");
        const res2 = await api.get("api/special-days/");
        setHours(res.data.length > 0 ? res.data : DEFAULT_DAYS);
        setSpecialDays(res2.data);
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        setHours(DEFAULT_DAYS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);


  // Aggiorna un singolo giorno nell'array quando l'utente modifica una card
  const handleChangeDay = (index: number, updated: OpeningHour) => {
    setHours((prev) => prev.map((h, i) => (i === index ? updated : h)));
  };

  // Salva tutti i giorni: POST se id=0 (nuovo), PATCH se già esiste
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const saved = await Promise.all(
        hours.map(async (hour) => {
          if (hour.id === 0) {
            const res = await api.post("api/opening-hours/", hour);
            return res.data as OpeningHour; // backend assegna l'id reale
          } else {
            await api.patch(`api/opening-hours/${hour.id}/`, hour);
            return hour;
          }
        })
      );
      setHours(saved); // aggiorna con gli id reali restituiti dal backend
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    } finally {
      setSaving(false);
    }
  };

  // Apre modale per nuovo giorno speciale
  const handleAddSpecial = () => { setEditingSpecial(EMPTY_SPECIAL); setModalOpen(true); };

  // Apre modale precompilata per modifica
  const handleEditSpecial = (day: SpecialDay) => { setEditingSpecial(day); setModalOpen(true); };

  // Elimina con conferma
  const handleDeleteSpecial = async (day: SpecialDay) => {
    if (!confirm(`Eliminare "${day.name}"?`)) return;
    await api.delete(`api/special-days/${day.id}/`);
    setSpecialDays((prev) => prev.filter(d => d.id !== day.id));
  };

  // Salva (POST se nuovo, PATCH se esiste)
  const handleSaveSpecial = async () => {
    if (!editingSpecial) return;
    if (editingSpecial.id === 0) {
      const res = await api.post("api/special-days/", editingSpecial);
      setSpecialDays((prev) => [...prev, res.data]);
    } else {
      await api.patch(`api/special-days/${editingSpecial.id}/`, editingSpecial);
      setSpecialDays((prev) => prev.map(d => d.id === editingSpecial.id ? editingSpecial : d));
    }
    setModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
        <button onClick={() => setShowSpecialDays(!showSpecialDays)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm">
            <Plus size={16} /> Cambia Visualizzaione
        </button>
    {!showSpecialDays && 
        <>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-amber-700">Orari</h2>
            <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 text-sm"
            >
            {saving ? "Salvataggio..." : "Salva tutto"}
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {hours.map((hour, index) => (
            <HourCard
                key={hour.day_of_week}
                data={hour}
                onChange={(updated) => handleChangeDay(index, updated)}
            />
            ))}
        </div>
        </>
    }
      {/* Sezione Giorni Speciali */}
    {showSpecialDays &&  
        <>
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-amber-800">Giorni Speciali</h2>
                <button onClick={handleAddSpecial} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm">
                    <Plus size={16} /> Aggiungi
                </button>
                </div>
                <AdminTable
                columns={[
                    { header: "Nome",     render: d => d.name },
                    { header: "Visibile", render: d => d.is_show ? "Sì" : "No" },
                    { header: "Aperto",   render: d => d.is_open ? "Sì" : "No" },
                    { header: "Pranzo",   render: d => d.lunch_open && d.lunch_close ? `${d.lunch_open.slice(0,5)} – ${d.lunch_close.slice(0,5)}` : "–" },
                    { header: "Cena",     render: d => d.dinner_open && d.dinner_close ? `${d.dinner_open.slice(0,5)} – ${d.dinner_close.slice(0,5)}` : "–" },
                ]}
                data={specialDays}
                onEdit={handleEditSpecial}
                onDelete={handleDeleteSpecial}
                />
            </div>

            {/* Modale aggiunta/modifica giorno speciale */}
            {modalOpen && editingSpecial && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <AdminModal
                    title={editingSpecial.id === 0 ? "Nuovo giorno speciale" : "Modifica giorno speciale"}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveSpecial}
                >
                    <label className="text-sm text-gray-600">Nome</label>
                    <input
                    value={editingSpecial.name}
                    onChange={e => setEditingSpecial(prev => ({ ...prev!, name: e.target.value }))}
                    className={inputCls}
                    />
                    <FormToggle label="Visibile sul sito" name="is_show" checked={editingSpecial.is_show}
                    onChange={e => setEditingSpecial(prev => ({ ...prev!, is_show: e.target.checked }))} />
                    <FormToggle label="Aperto" name="is_open" checked={editingSpecial.is_open}
                    onChange={e => setEditingSpecial(prev => ({ ...prev!, is_open: e.target.checked }))} />
                    {editingSpecial.is_open && (
                    <>
                        <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Pranzo apertura</label>
                            <input type="time" value={editingSpecial.lunch_open ?? ""}
                            onChange={e => setEditingSpecial(prev => ({ ...prev!, lunch_open: e.target.value || null }))}
                            className={inputCls} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Pranzo chiusura</label>
                            <input type="time" value={editingSpecial.lunch_close ?? ""}
                            onChange={e => setEditingSpecial(prev => ({ ...prev!, lunch_close: e.target.value || null }))}
                            className={inputCls} />
                        </div>
                        </div>
                        <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Cena apertura</label>
                            <input type="time" value={editingSpecial.dinner_open ?? ""}
                            onChange={e => setEditingSpecial(prev => ({ ...prev!, dinner_open: e.target.value || null }))}
                            className={inputCls} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Cena chiusura</label>
                            <input type="time" value={editingSpecial.dinner_close ?? ""}
                            onChange={e => setEditingSpecial(prev => ({ ...prev!, dinner_close: e.target.value || null }))}
                            className={inputCls} />
                        </div>
                        </div>
                    </>
                    )}
                </AdminModal>
                </div>
            )}
        </>
    }
    </div>
  );
}
