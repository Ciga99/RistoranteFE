import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { AdminModal } from "../../components/adminComponent/AdminModal";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { MenuType } from "../../types/menu";

// I campi del form vuoto per aggiungere un nuovo menu
const emptyForm = {
  type: "menu_card" as "menu_card" | "daily_menu",
  notes: "",
  date: "",
  day_of_week: "",
  is_active: true,
};

export default function AdminMenuPage() {
  // "menus" è lo scaffale dove mettiamo tutti i menu arrivati dal server
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  // "modalOpen" dice se il pop-up è aperto o chiuso
  const [modalOpen, setModalOpen] = useState(false);

  // "editingMenu" contiene il menu che stiamo modificando (null = ne stiamo aggiungendo uno nuovo)
  const [editingMenu, setEditingMenu] = useState<MenuType | null>(null);

  // "form" contiene i valori scritti nel form
  const [form, setForm] = useState(emptyForm);

  // Funzione che chiede i menu al server
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

  // Carica i menu appena la pagina si apre
  useEffect(() => { fetchMenus(); }, []);

  // Aggiorna il form quando l'utente scrive in un campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Salva: se stiamo modificando → PUT, se stiamo aggiungendo → POST
  const handleSave = async () => {
    try {
      if (editingMenu) {
        await api.put(`api/menu/${editingMenu.id}/`, form);
      } else {
        await api.post("api/menu/", form);
      }
      setModalOpen(false);
      fetchMenus(); // ricarica la lista aggiornata
    } catch (err) {
      console.error("Errore nel salvare", err);
    }
  };

  // Elimina un menu dopo conferma
  const handleDelete = async (id: number) => {
    if (!confirm("Sicuro di voler eliminare questo menu?")) return;
    try {
      await api.delete(`api/menu/${id}/`);
      fetchMenus();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  // Apre il modal per modificare un menu esistente
  const openEdit = (menu: MenuType) => {
    setEditingMenu(menu);
    setForm({
      type: menu.type,
      notes: menu.notes ?? "",
      date: menu.date ?? "",
      day_of_week: menu.day_of_week?.toString() ?? "",
      is_active: menu.is_active,
    });
    setModalOpen(true);
  };

  // Apre il modal per aggiungere un nuovo menu
  const openAdd = () => {
    setEditingMenu(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      {/* Intestazione pagina */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-700">Gestione Menu</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus size={18} /> Aggiungi Menu
        </button>
      </div>

      {/* Griglia di card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.map(menu => (
          <div key={menu.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            {/* Badge tipo */}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${menu.type === "daily_menu" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
              {menu.type === "daily_menu" ? "Menu del giorno" : "Carta"}
            </span>
            <p className="mt-2 text-gray-700 text-sm">{menu.notes || "Nessuna nota"}</p>
            {menu.date && <p className="text-xs text-gray-400 mt-1">Data: {menu.date}</p>}
            <p className="text-xs text-gray-400 mt-1">Piatti: {menu.dishes?.length ?? 0}</p>
            {/* Badge attivo/inattivo */}
            <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${menu.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              {menu.is_active ? "Attivo" : "Non attivo"}
            </span>
            {/* Bottoni azione */}
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(menu)} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800">
                <Pencil size={14} /> Modifica
              </button>
              <button onClick={() => handleDelete(menu.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <Trash2 size={14} /> Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal aggiunta/modifica */}
      {modalOpen && (
        <AdminModal
          title={editingMenu ? "Modifica Menu" : "Aggiungi Menu"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        >
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900">
            <option value="menu_card">Carta</option>
            <option value="daily_menu">Menu del giorno</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Note</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900" rows={3} />

          {form.type === "daily_menu" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-2">Data</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900" />
            </>
          )}

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            <span className="text-sm text-gray-700">Attivo</span>
          </label>
        </AdminModal>
      )}
    </div>
  );
}