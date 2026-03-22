import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ArrowLeft } from "lucide-react";
import HeaderFrom from "../../components/adminComponent/HeaderForm";
import Spinner from "../../components/Spinner";

const emptyForm = { room: 0, guest_name: "", date_from: "", date_to: "", guests: 1 };

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

export default function AdminBookingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchBooking = async () => {
      try {
        const res = await api.get(`api/bookings/${id}/`);
        const b = res.data;
        setForm({ room: b.room, guest_name: b.guest_name, date_from: b.date_from, date_to: b.date_to, guests: b.guests });
      } catch (err) {
        console.error("Errore nel caricare la prenotazione", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`api/bookings/${id}/`, form);
      } else {
        await api.post("api/bookings/", form);
      }
      navigate("/admin/calendar-admin");
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 max-w-xl">
      <HeaderFrom title ={isEdit ? "Modifica Prenotazione" : "Aggiungi Prenotazione"} navigateUrl="/admin/calendar-admin"/>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome ospite</label>
          <input name="guest_name" value={form.guest_name} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Stanza</label>
          <input type="number" name="room" value={form.room} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data arrivo</label>
          <input type="date" name="date_from" value={form.date_from} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data partenza</label>
          <input type="date" name="date_to" value={form.date_to} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numero ospiti</label>
          <input type="number" name="guests" value={form.guests} onChange={handleChange} min={1} className={inputCls} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/admin/calendar-admin")}
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
