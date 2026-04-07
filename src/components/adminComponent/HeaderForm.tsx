import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderFrom { 
    title: string;
    navigateUrl:  string;
}

export default function HeaderFrom({title, navigateUrl}: AdminHeaderFrom){
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-2 mb-6">
            <button
            onClick={() => navigate(navigateUrl)}
            className="flex items-center text-gray-500 hover:text-gray-800"
            >
            <ArrowLeft className="text-white hover:text-gray-800" size={16} /> 
            </button>
            <span className="font-medium">{title}</span>
        </div>
    )
}