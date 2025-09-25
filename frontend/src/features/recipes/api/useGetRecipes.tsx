import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetRecipes() {
  const {isPending, error, data } = useQuery({
    queryKey: ['recipesData'],
    queryFn: async () => {
      const response = await api.get(
        '/recipes',
      )
      return response.data
    }
  })

  return {isPending, error, data} 
}
