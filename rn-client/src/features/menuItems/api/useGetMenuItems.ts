import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { TMenuItem } from '@/entities/menuItem';

export const fetchMenuItems = async (): Promise<TMenuItem[]> => {
  const response = await api.get('/menu-items');
  const arr = (response.data ?? []) as Array<{ id: number; body?: string }>;
  return arr.map((row, idx) => {
    const body = (row.body ?? '').trim();
    const lines = body.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const title = lines[0] ?? `Item ${row.id ?? idx + 1}`;
    const parts = title.split(/\s*[—-]\s*/);
    let category: TMenuItem['category'] | 'Menu Items' = 'Menu Items';
    let name = title;
    if (parts.length >= 2) {
      category = (parts[0].trim() || 'Menu Items') as TMenuItem['category'] | 'Menu Items';
      name = parts.slice(1).join(' - ').trim() || title;
    }
    const ingredients = lines.slice(1);
    return {
      id: row.id ?? idx + 1,
      category,
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

