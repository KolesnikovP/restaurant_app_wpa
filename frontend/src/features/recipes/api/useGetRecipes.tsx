import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";
import type { TRecipe } from "@/entities/recipe";

/**
 * Why expose both `fetchRecipes` and `useGetRecipes`?
 *
 * - Prefetch requires a plain async function: `queryClient.prefetchQuery` cannot
 *   call React hooks. Providing `fetchRecipes` lets UI elements (e.g. tabs) trigger
 *   prefetch on hover/touch/focus without violating the Rules of Hooks.
 * - Single source of truth: the hook below reuses `fetchRecipes`, so the request
 *   logic lives in one place while staying usable from both hooks and non-hook
 *   contexts. This avoids duplication and keeps caching keys consistent.
 */

export const fetchRecipes = async (): Promise<TRecipe[]> => {
  const response = await api.get('/recipes');
  return response.data as TRecipe[];
}

/** Thin hook wrapper around the fetcher for convenience in components. */
export function useGetRecipes() {
  const {isPending, error, data } = useQuery<TRecipe[]>({
    queryKey: ['recipesData'],
    queryFn: fetchRecipes,
    staleTime: 30_000,
  })

  return {isPending, error, data: data ?? []} 
}
