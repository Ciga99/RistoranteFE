import type { MenuType, DishType } from "../../types/menu.tsx";

const MENU_LABELS: Record<MenuType["type"], string> = {
    special_menu: "Menu Speciale",
    menu_card:  "Menu alla Carta",
};

// Mappa ogni valore del tipo "type" alla sua etichetta leggibile in italiano
const CATEGORY_LABELS: Record<DishType["type"], string> = {
    antipasto: "Antipasti",
    primo:     "Primi",
    secondo:   "Secondi",
    contorno:  "Contorni",
    dolce:     "Dolci",
    bevande:   "Bevande",
};

// Ordine fisso in cui le categorie vengono mostrate nel menu
const CATEGORY_ORDER: DishType["type"][] = [
    "antipasto", "primo", "secondo", "contorno", "dolce", "bevande"
];

export default function MenuComponent({ menu }: { menu: MenuType }) {
    // Raggruppa i piatti per categoria seguendo CATEGORY_ORDER.
    // Per ogni categoria, filtra i piatti corrispondenti;
    // se non ce ne sono, la categoria non viene aggiunta all'oggetto.
    const grouped = CATEGORY_ORDER.reduce<Record<string, DishType[]>>((acc, cat) => {
        const items = menu.dishes.filter((item) => item.type === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    return (
        <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-black">
                {MENU_LABELS[menu.type]}
            </h2>
            {/* Itera solo le categorie che hanno almeno un piatto */}
            {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-8">
                    {/* Intestazione della categoria (es. ANTIPASTI, PRIMI...) */}
                    <h3 className="text-lg font-semibold uppercase tracking-widest text-black">
                        {CATEGORY_LABELS[cat as DishType["type"]]}
                    </h3>
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            // Riga del singolo piatto: nome+descrizione a sinistra, prezzo a destra
                            <div key={item.id} className="flex justify-between items-start border-b border-black pb-3 text-black">
                                <div>
                                    <p className="font-semibold text-black">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                {/* parseFloat perché price arriva come stringa da DRF */}
                                <p className="font-bold ml-4 shrink-0 text-black">€{parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

