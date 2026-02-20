import type { MenuType, MenuTypeItem } from "../../types/menu.tsx";

// Mappa ogni valore del tipo "type" alla sua etichetta leggibile in italiano
const CATEGORY_LABELS: Record<MenuTypeItem["type"], string> = {
    antipasto: "Antipasti",
    primo:     "Primi",
    secondo:   "Secondi",
    contorno:  "Contorni",
    dolce:     "Dolci",
    bevande:   "Bevande",
};

// Ordine fisso in cui le categorie vengono mostrate nel menu
const CATEGORY_ORDER: MenuTypeItem["type"][] = [
    "antipasto", "primo", "secondo", "contorno", "dolce", "bevande"
];

export default function MenuComponent({ menu }: { menu: MenuType }) {
    // Raggruppa i piatti per categoria seguendo CATEGORY_ORDER.
    // Per ogni categoria, filtra i piatti corrispondenti;
    // se non ce ne sono, la categoria non viene aggiunta all'oggetto.
    const grouped = CATEGORY_ORDER.reduce<Record<string, MenuTypeItem[]>>((acc, cat) => {
        const items = menu.food.filter((item) => item.type === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    return (
        <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{menu.name}</h2>
            {/* Itera solo le categorie che hanno almeno un piatto */}
            {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-8">
                    {/* Intestazione della categoria (es. ANTIPASTI, PRIMI...) */}
                    <h3 className="text-lg font-semibold uppercase tracking-widest text-gray-500 mb-3">
                        {CATEGORY_LABELS[cat as MenuTypeItem["type"]]}
                    </h3>
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            // Riga del singolo piatto: nome+descrizione a sinistra, prezzo a destra
                            <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                {/* toFixed(2) formatta il prezzo con 2 decimali (es. €8.50) */}
                                <p className="font-bold ml-4 shrink-0">€{item.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

