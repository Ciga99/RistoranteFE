export type DishType = {
    id: number;
    type: "antipasto" | "primo" | "secondo" | "contorno" | "dolce" | "bevande";
    name: string;
    description: string;
    price: string;
    is_active: boolean;
    created_at: string;
}

export type MenuType = {
    id: number;
    type: "special_menu" | "menu_card";
    notes: string;
    date: string | null;
    day_of_week: number | null;
    dishes: DishType[];
    is_active: boolean;
}

// Alias per retrocompatibilità
export type MenuTypeItem = DishType;