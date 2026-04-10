export type OpeningHour = {
  id: number;
  day_of_week: number;
  day_label: string;
  is_open: boolean;
  lunch_open: string | null;
  lunch_close: string | null;
  dinner_open: string | null;
  dinner_close: string | null;
};

export type SpecialDay = {
  id: number;
  name: string;
  date: string | null;
  is_show: boolean;
  is_open: boolean;
  lunch_open: string | null;
  lunch_close: string | null;
  dinner_open: string | null;
  dinner_close: string | null;
};
