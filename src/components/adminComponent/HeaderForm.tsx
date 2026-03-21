import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderFrom { 
    title: string;
    navigateUrl:  string;
}

export default function HeaderFrom({title, navigateUrl}: AdminHeaderFrom){
    const navigate = useNavigate();
    return (
        <div className="flex items-center ">
            <button
            onClick={() => navigate(navigateUrl)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
            >
            <ArrowLeft size={16} /> 
            </button>
            {title}
        </div>
    )
}