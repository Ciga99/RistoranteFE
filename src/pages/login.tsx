import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const auth = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handelSubmit = async (e : React.FormEvent) => { 
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await auth.login(username, password);
        }catch{ 
            setError("Emial o password errati");
        } finally {
            setLoading(false);
        }

    };
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center">
            <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                alt="La Mia Romagna"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 bg-white rounded-lg shadow-md p-8 w-full max-w-sm mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                        La Mia Romagna
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Area Gestione</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handelSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-amber-700"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                   
                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-amber-700 hover:bg-amber-500 disabled:opacity-50 text-white font-medium py-2 rounded-md transition-colors"
                    >
                        {loading ? "Accesso in corso..." : "Accedi"}
                    </button>
                </form>
            </div>
        </div>
    );
}
