import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import AdminFormCard, { inputCls } from "../../components/adminComponent/AdminFormCard";
import FormToggle from "../../components/adminComponent/FormToggle";
import Spinner from "../../components/Spinner";
import { Trash2, Upload } from "lucide-react";

const MAX_PHOTOS = 20;
const API_BASE = import.meta.env.VITE_API_URL as string;

type Photo = { id: number; image: string };

const emptyForm = {
  name: "",
  description: "",
  capacity: "",
  price_per_night: "",
  is_active: true,
};

export default function AdminRoomsFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    const fetchRoom = async () => {
      try {
        const res = await api.get(`api/rooms/admin/${id}/`);
        const r = res.data;
        setForm({
          name: r.name ?? "",
          description: r.description ?? "",
          capacity: r.capacity?.toString() ?? "",
          price_per_night: r.price_per_night?.toString() ?? "",
          is_active: r.is_active,
        });
        setPhotos(r.images ?? []);
      } catch (err) {
        console.error("Errore nel caricare la stanza", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        capacity: Number(form.capacity),
        price_per_night: Number(form.price_per_night),
      };
      if (isEdit) {
        await api.put(`api/rooms/admin/${id}/`, payload);
      } else {
        const res = await api.post("api/rooms/admin/", payload);
        const newId = res.data.id;
        for (const file of pendingFiles) {
          const fd = new FormData();
          fd.append("image", file);
          await api.post(`api/rooms/admin/${newId}/photos/`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }
      navigate("/admin/rooms-admin");
    } catch (err) {
      console.error("Errore nel salvare la stanza", err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    if (isEdit) {
      const available = MAX_PHOTOS - photos.length;
      const toUpload = files.slice(0, available);
      setUploading(true);
      try {
        let updatedPhotos = photos;
        for (const file of toUpload) {
          const fd = new FormData();
          fd.append("image", file);
          const res = await api.post(`api/rooms/admin/${id}/photos/`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          updatedPhotos = res.data.images;
        }
        setPhotos(updatedPhotos);
      } catch (err) {
        console.error("Errore nel caricare la foto", err);
      } finally {
        setUploading(false);
      }
    } else {
      const available = MAX_PHOTOS - pendingFiles.length;
      setPendingFiles(prev => [...prev, ...files.slice(0, available)]);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm("Eliminare questa foto?")) return;
    try {
      await api.delete(`api/rooms/admin/photos/${photoId}/`);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error("Errore nell'eliminare la foto", err);
    }
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const totalPhotos = isEdit ? photos.length : pendingFiles.length;
  const atLimit = totalPhotos >= MAX_PHOTOS;

  if (loading) return <Spinner />;

  return (
    <AdminFormCard
      title={isEdit ? "Modifica Stanza" : "Aggiungi Stanza"}
      backUrl="/admin/rooms-admin"
      onSave={handleSave}
      saving={saving}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputCls}
          placeholder="Es. Camera Doppia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={inputCls}
          placeholder="Descrizione della stanza..."
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Posti letto</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            min={1}
            className={inputCls}
            placeholder="Es. 2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo/notte (€)</label>
          <input
            type="number"
            name="price_per_night"
            value={form.price_per_night}
            onChange={handleChange}
            min={0}
            step="0.01"
            className={inputCls}
            placeholder="Es. 85.00"
          />
        </div>
      </div>

      <FormToggle label="Attiva" name="is_active" checked={form.is_active} onChange={handleChange} />

      {/* Sezione foto */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-amber-700">Foto</h3>
          <span className={`text-sm font-medium ${atLimit ? "text-red-500" : "text-gray-500"}`}>
            {totalPhotos} / {MAX_PHOTOS}
          </span>
        </div>

        {/* Griglia foto */}
        {isEdit ? (
          photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square">
                  <img
                    src={`${API_BASE}${photo.image}`}
                    alt="Foto stanza"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Elimina foto"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-4">Nessuna foto caricata.</p>
          )
        ) : (
          pendingFiles.length > 0 ? (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {pendingFiles.map((file, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Anteprima"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePending(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rimuovi"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-4">Nessuna foto aggiunta.</p>
          )
        )}

        {/* Bottone upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={atLimit || uploading}
          className="flex items-center gap-2 px-4 py-2 border border-amber-400 text-amber-700 rounded hover:bg-amber-50 disabled:opacity-40 text-sm"
        >
          <Upload size={15} />
          {uploading ? "Caricamento..." : atLimit ? "Limite raggiunto" : "Aggiungi foto"}
        </button>
        {!isEdit && pendingFiles.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">Le foto verranno caricate al salvataggio.</p>
        )}
      </div>
    </AdminFormCard>
  );
}
