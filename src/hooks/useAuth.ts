// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
//Cosa fa: È una scorciatoia per usare il context nei componenti.
export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
    return ctx;
}
// Utilizzo nei componenti:
// const { login, logout, isAuthenticated } = useAuth();