export type RoomType = {
    id: number;
    name: string;
    description: string;
    capacity: number;
    price_per_night: number;
    images: { image: string }[];
    is_active: boolean;
}
