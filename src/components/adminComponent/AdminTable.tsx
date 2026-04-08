import { Eye, Pencil, Trash2 } from "lucide-react";

// Definizione di una singola colonna
// header = titolo della colonna
// render = funzione che dice come mostrare il valore in quella cella
export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: number }> {
  columns: Column<T>[];       // lista delle colonne
  data: T[];                  // lista dei dati (menu, piatti, ecc.)
  onEdit: (row: T) => void;   // chiamata quando premi ✏️
  onDelete: (row: T) => void; // chiamata quando premi 🗑
  onDetail?: (row: T) => void; // chiamata quando premi 👁 (opzionale)
}

export function AdminTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onDetail,
}: AdminTableProps<T>) {
  return (
    <div className="max-h-[69vh] bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-amber-50 text-amber-700 font-semibold">
          <tr>
            {columns.map(col => (
              <th key={col.header} className="px-4 py-3 text-left">{col.header}</th>
            ))}
            <th className="px-4 py-3 text-left">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.header} className="px-4 py-3 text-gray-800">
                  {col.render(row)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-3 items-center">
                  {/* {onDetail && (
                    <button
                      onClick={() => onDetail(row)}
                      title="Dettaglio"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye size={15} />
                    </button>
                  )} */}
                  <button
                    onClick={() => {onEdit(row);}}
                    title="Modifica"
                    className="text-amber-600 hover:text-amber-800"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    title="Elimina"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-gray-400"
              >
                Nessun elemento trovato
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}