import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                alt="Mia Romagna"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 bg-white rounded-lg shadow-md p-8 w-full max-w-sm mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Mia Romagna
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Area Gestione</p>
                </div>

                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="admin@miaromagna.it"
                            className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-amber-700"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-amber-700 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-0 bg-transparent p-0"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-black pr-4">Ricordami</p>
                        <input type="checkbox" name="onion"/>     
                    </div>
                   
                    <button
                        type="submit"
                        className="mt-2 bg-amber-700 hover:bg-amber-500 text-white font-medium py-2 rounded-md transition-colors"
                    >
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    );
}
