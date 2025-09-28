import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";
import type { TMenuItem } from "../model/types";

// Fetch from backend menu items and adapt into the Menu UI shape used by the app.
export const fetchMenuItems = async (): Promise<TMenuItem[]> => {
  const response = await api.get('/menu-items');
  const arr = (response.data ?? []) as Array<{ id: number; body?: string }>;
  return arr.map((row, idx) => {
    const body = (row.body ?? '').trim();
    const lines = body.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const title = lines[0] ?? `Item ${row.id ?? idx+1}`;
    // Split possible "Category — Name" with em dash or hyphen
    const parts = title.split(/\s*[—-]\s*/);
    let category = 'Menu Items';
    let name = title;
    if (parts.length >= 2) {
      category = parts[0].trim() || 'Menu Items';
      name = parts.slice(1).join(' - ').trim() || title;
    }
    const ingredients = lines.slice(1);
    return {
      id: row.id ?? idx + 1,
      category: category as TMenuItem['category'] | 'Menu Items',
      name,
      ingredients,
    } as unknown as TMenuItem;
  });
};

export function useGetMenuItems() {
  const { isPending, error, data } = useQuery<TMenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems,
    staleTime: 30_000,
  });
  return { isPending, error, data: data ?? [] };
}

