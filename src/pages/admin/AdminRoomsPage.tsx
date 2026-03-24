import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { RoomType } from "../../types/rooms";
import { Plus } from "lucide-react";
import { AdminTable } from "../../components/adminComponent/AdminTable";
import { useNavigate } from "react-router-dom";
import FormToggle from "../../components/adminComponent/FormToggle";
import Spinner from "../../components/Spinner";

export default function AdminRoomsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/rooms/admin/");
      setRooms(response.data);
    } catch (err) {
      console.error("Errore nel caricare le stanze", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (room: RoomType) => {
    if (!confirm(`Sicuro di voler eliminare "${room.name}"?`)) return;
    try {
      await api.delete(`api/rooms/admin/${room.id}/`);
      fetchRooms();
    } catch (err) {
      console.error("Errore nell'eliminare la stanza", err);
    }
  };

  const handleToggleActive = async (room: RoomType) => {
    try {
      await api.patch(`api/rooms/admin/${room.id}/`, { is_active: !room.is_active });
      fetchRooms();
    } catch (err) {
      console.error("Errore nel cambiare lo stato", err);
    }
  };

  const columns = [
    {
      header: "Nome",
      render: (r: RoomType) => <span className="text-gray-700 font-medium">{r.name}</span>,
    },
    {
      header: "Posti",
      render: (r: RoomType) => <span className="text-gray-600">{r.capacity}</span>,
    },
    {
      header: "Prezzo/notte",
      render: (r: RoomType) => <span className="text-gray-600">€ {r.price_per_night}</span>,
    },
    {
      header: "Descrizione",
      render: (r: RoomType) => (
        <span className="text-gray-500 text-xs line-clamp-2">{r.description || "—"}</span>
      ),
    },
    {
      header: "Stato",
      render: (r: RoomType) => (
        <FormToggle
          label=""
          name="is_active"
          checked={r.is_active}
          onChange={() => handleToggleActive(r)}
        />
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-700">Gestione Stanze</h2>
        <button
          onClick={() => navigate("/admin/rooms-admin/new")}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          <Plus size={18} /> Aggiungi Stanza
        </button>
      </div>
      <AdminTable
        columns={columns}
        data={rooms}
        onEdit={(r) => navigate(`/admin/rooms-admin/${r.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
