import { useNavigate } from "react-router-dom";
import HeaderFrom from "./HeaderForm";

export const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";

interface AdminFormCardProps {
  title: string;
  backUrl: string;
  onSave: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

export default function AdminFormCard({ title, backUrl, onSave, saving = false, children }: AdminFormCardProps) {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <HeaderFrom title={title} navigateUrl={backUrl} />
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
        {children}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(backUrl)}
            className="px-4 py-2 rounded border border-gray-300 text-white hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={onSave}
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
