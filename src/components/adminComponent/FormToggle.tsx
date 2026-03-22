interface FromToggleProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormToggle({label, name, checked, onChange}: FromToggleProps){
    return(
        <label className="felx items-center gap-3 cursor-pointer  select-none">
            <div className="relative">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${checked ? "bg-amber-500" : "bg-gray-300"}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}