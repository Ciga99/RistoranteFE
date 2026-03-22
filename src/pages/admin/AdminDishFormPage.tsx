import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { DishType } from "../../types/menu";
import AdminFormCard, { inputCls } from "../../components/adminComponent/AdminFormCard";
import FormSelect from "../../components/adminComponent/FormSelect";
import FormToggle from "../../components/adminComponent/FormToggle";
import Spinner from "../../components/Spinner";

const DISH_TYPES = ["antipasto", "primo", "secondo", "contorno", "dolce", "bevande"] as const;

const emptyForm = {
  name: "",
  type: "primo" as DishType["type"],
  description: "",
  price: "",
  is_active: true,
};

export default function AdminDishFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchDish = async () => {
      try {
        const res = await api.get(`api/dishes/${id}/`);
        console.log("res", res)
        const d = res.data;
        setForm({ name: d.name, type: d.type, description: d.description, price: d.price, is_active: d.is_active });
      } catch (err) {
        console.error("Errore nel caricare il piatto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id, isEdit]);

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
        await api.put(`api/dishes/${id}/`, form);
      } else {
        await api.post("api/dishes/", form);
      }
      navigate("/admin/dish-admin");
    } catch (err) {
      console.error("Errore nel salvare", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <AdminFormCard
      title={isEdit ? "Modifica Piatto" : "Aggiungi Piatto"}
      backUrl="/admin/dish-admin"
      onSave={handleSave}
      saving={saving}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Es. Tagliatelle al ragù" />
      </div>
      <FormSelect 
        label="Tipo"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={DISH_TYPES.map(t => ({ value: t, label: t}))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
        <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={2} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€)</label>
        <input name="price" value={form.price} onChange={handleChange} className={inputCls} placeholder="Es. 12.50" />
      </div>

      <FormToggle label="Attivo" name="is_active" checked={form.is_active} onChange={handleChange} />
    </AdminFormCard>
  );
}
