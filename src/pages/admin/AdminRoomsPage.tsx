import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { RoomType } from "../../types/rooms";
import { AdminModal } from "../../components/adminComponent/AdminModal";
import { Pencil, Trash2, Plus } from "lucide-react";

const emptyForm = { name: "", description: "", beds: 1, priceNight: 0 };

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/rooms/");
      setRooms(res.data);
    } catch (err) {
      console.error("Errore nel caricare le stanze", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSave = async () => {
    try {
      if (editingRoom) {
        await api.put(`api/rooms/${editingRoom.id}/`, form);
      } else {
        await api.post("api/rooms/", form);
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error("Errore nel salvare", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sicuro di voler eliminare questa stanza?")) return;
    try {
      await api.delete(`api/rooms/${id}/`);
      fetchRooms();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const openEdit = (room: RoomType) => {
    setEditingRoom(room);
    setForm({ name: room.name, description: room.description, beds: room.beds, priceNight: room.priceNight });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-700">Gestione Stanze</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">
          <Plus size={18} /> Aggiungi Stanza
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-lg">{room.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{room.description}</p>
            <p className="text-sm text-gray-600 mt-2">🛏 {room.beds} {room.beds === 1 ? "letto" : "letti"}</p>
            <p className="text-amber-600 font-bold mt-1">€ {room.priceNight} / notte</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(room)} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800">
                <Pencil size={14} /> Modifica
              </button>
              <button onClick={() => handleDelete(room.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <Trash2 size={14} /> Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AdminModal
          title={editingRoom ? "Modifica Stanza" : "Aggiungi Stanza"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        >
          <label className="block text-sm font-medium text-gray-700">Nome stanza</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Es. Suite Vista Mare" />

          <label className="block text-sm font-medium text-gray-700 mt-2">Descrizione</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={3} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Numero letti</label>
          <input type="number" name="beds" value={form.beds} onChange={handleChange} min={1} className={inputCls} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Prezzo per notte (€)</label>
          <input type="number" name="priceNight" value={form.priceNight} onChange={handleChange} min={0} className={inputCls} />
        </AdminModal>
      )}
    </div>
  );
}
