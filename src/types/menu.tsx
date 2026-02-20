export type MenuType = {
    id: number;
    name: string;
    food: MenuTypeItem[];
}

export type MenuTypeItem = {
    id: number;
    type: "antipasto" | "primo" | "secondo" | "contorno" | "dolce" | "bevande";
    name: string;
    description: string;
    price: number;
}