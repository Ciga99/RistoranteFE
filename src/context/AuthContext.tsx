import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    login: (emial: string, password: string) => Promise<void>;
    logout: ()=>void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// 3. Creiamo il Provider = il componente che "avvolge" tutta l'app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // All'avvio, controlliamo se c'è già un token salvato (sessione precedente)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("access_token")
  );

  // FUNZIONE LOGIN: chiamata quando premi "Accedi"
  const login = async (username: string, password: string) => {
    // Manda la richiesta HTTP al backend
    const res = await api.post("api/auth/login/", { username, password });
    // res.data sarà tipo: { access: "eyJ...", refresh: "eyJ..." }

    const accessToken = res.data.access;

    // Salva il token nel cassetto del browser
    localStorage.setItem("access_token", accessToken);

    // Aggiorna lo stato React (fa ri-renderizzare i componenti)
    setToken(accessToken);

    // Vai alla dashboard admin
    navigate("/admin");
  };

  // FUNZIONE LOGOUT: rimuove tutto
  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated: !!token,  // converte stringa in true/false
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}