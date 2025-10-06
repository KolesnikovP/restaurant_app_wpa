export type TMenuItem = {
  id: number;
  category: 'Protein Shakes' | 'Smoothies' | 'Signature / Seasonal Drinks' | 'Menu Items';
  name: string;
  ingredients: string[];
  notes?: string;
};

