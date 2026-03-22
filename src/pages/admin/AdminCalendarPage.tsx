import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { BookingType } from "../../types/bookings";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCalendarPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Sicuro di voler eliminare questa prenotazione?")) return;
    try {
      await api.delete(`api/bookings/${id}/`);
      fetchBookings();
    } catch (err) {
      console.error("Errore nell'eliminare", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-700">Calendario Prenotazioni</h2>
        <button
          onClick={() => navigate("/admin/calendar-admin/new")}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
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
                    <button onClick={() => navigate(`/admin/calendar-admin/${b.id}/edit`)} className="text-amber-600 hover:text-amber-800"><Pencil size={14} /></button>
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
    </div>
  );
}
