import { inputCls } from "./AdminFormCard";

interface SelectionOption {
    value: string;
    label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectionOption[];
  placeholder?: string; // opzione vuota iniziale facoltativa
}

export default function FormSelect({label, name, value, onChange, options, placeholder}:FormSelectProps ){
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select name={name} value={value} onChange={onChange}  className={inputCls}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map( opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}