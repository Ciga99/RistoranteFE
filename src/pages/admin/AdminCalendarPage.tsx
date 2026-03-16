import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { BookingType } from "../../types/bookings";
import { AdminModal } from "../../components/adminComponent/AdminModal";
import { Pencil, Trash2, Plus } from "lucide-react";

const emptyForm = { room: 0, guest_name: "", date_from: "", date_to: "", guests: 1 };

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingType | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/bookings/");
      setBookings(res.data);
    } catch (err) {
      console.error("Errore nel caricare le prenotazioni", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSave = async () => {
    try {
      if (editingBooking) {
        await api.put(`api/bookings/${editingBooking.id}/`, form);
      } else {
        await api.post("api/bookings/", form);
      }
      setModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error("Errore nel salvare", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sicuro di voler eliminare questa prenotazione?")) return;
    try {
      await api.delete(`api/bookings/${id}/`);
      fetchBookings();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  const openEdit = (b: BookingType) => {
    setEditingBooking(b);
    setForm({ room: b.room, guest_name: b.guest_name, date_from: b.date_from, date_to: b.date_to, guests: b.guests });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingBooking(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Caricamento...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-700">Calendario Prenotazioni</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">
          <Plus size={18} /> Aggiungi Prenotazione
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-amber-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Ospite</th>
              <th className="px-4 py-3 text-left">Stanza</th>
              <th className="px-4 py-3 text-left">Arrivo</th>
              <th className="px-4 py-3 text-left">Partenza</th>
              <th className="px-4 py-3 text-left">Ospiti</th>
              <th className="px-4 py-3 text-left">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{b.guest_name}</td>
                <td className="px-4 py-3 text-gray-800">{b.room_name}</td>
                <td className="px-4 py-3 text-gray-800">{b.date_from}</td>
                <td className="px-4 py-3 text-gray-800">{b.date_to}</td>
                <td className="px-4 py-3 text-gray-800">{b.guests}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(b)} className="text-amber-600 hover:text-amber-800"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Nessuna prenotazione</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AdminModal
          title={editingBooking ? "Modifica Prenotazione" : "Aggiungi Prenotazione"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        >
          <label className="block text-sm font-medium text-gray-700">Nome ospite</label>
          <input name="guest_name" value={form.guest_name} onChange={handleChange} className={inputCls} />

          <label className="block text-sm font-medium text-gray-700 mt-2">ID Stanza</label>
          <input type="number" name="room" value={form.room} onChange={handleChange} className={inputCls} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Data arrivo</label>
          <input type="date" name="date_from" value={form.date_from} onChange={handleChange} className={inputCls} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Data partenza</label>
          <input type="date" name="date_to" value={form.date_to} onChange={handleChange} className={inputCls} />

          <label className="block text-sm font-medium text-gray-700 mt-2">Numero ospiti</label>
          <input type="number" name="guests" value={form.guests} onChange={handleChange} min={1} className={inputCls} />
        </AdminModal>
      )}
    </div>
  );
}
