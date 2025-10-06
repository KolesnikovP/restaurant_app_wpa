import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { TRecipe } from '@/entities/recipe';

export const fetchRecipes = async (): Promise<TRecipe[]> => {
  const res = await api.get('/recipes');
  return (res.data ?? []) as TRecipe[];
};

export function useGetRecipes() {
  const { data, isPending, error } = useQuery<TRecipe[]>({
    queryKey: ['recipesData'],
    queryFn: fetchRecipes,
    staleTime: 30_000,
  });
  return { data: data ?? [], isPending, error };
}

