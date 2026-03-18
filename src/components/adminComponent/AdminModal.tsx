interface AdminModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

export function AdminModal({ title, onClose, onSave, children }: AdminModalProps) {
  return (
    <div >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-700">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4 space-y-3">{children}</div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
            Annulla
          </button>
          <button onClick={onSave} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
