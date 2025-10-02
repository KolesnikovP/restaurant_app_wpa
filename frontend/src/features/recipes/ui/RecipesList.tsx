import { useGetRecipes } from "../api/useGetRecipes";
import type { TRecipe } from "@/entities/recipe";
import { Card } from "@/shared/ui/Card";
import { RecipeDescription } from "./RecipeDescription";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedId: number | null;
  onSelectId: (id: number | null) => void;
  query?: string;
};

export function RecipesList({ selectedId, onSelectId, query = "" }: Props) {
  const { data: recipes, isPending, error } = useGetRecipes();
  const navigate = useNavigate();

  const filtered = recipes.filter((r) =>
    query.trim().length === 0
      ? true
      : (r.recipe_name + " " + (r.description ?? "")).toLowerCase().includes(query.toLowerCase())
  );

  if (isPending) return <div className="opacity-70 text-sm">Loading recipes…</div>;
  if (error) return <div className="text-red-300 text-sm">Failed to load recipes</div>;

  const handleToggle = (r: TRecipe) => {
    onSelectId(selectedId === r.id ? null : r.id);
  };
  const goToDetails = (id: number) => navigate(`/recipe/${id}`);

  return (
    <div className="grid gap-3">
      {filtered.map((r) => {
        const isOpen = r.id === selectedId;
        return (
          <div key={r.id} className="grid gap-2">
            <Card
              title={r.recipe_name}
              subtitle={`Shelf life: ${r.shelf_life}`}
              onClick={() => goToDetails(r.id)}
            >
              {isOpen ? (
                <RecipeDescription text={r.description} />
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm opacity-80 ${isOpen ? '' : 'line-clamp-2'}`}>{r.description}</p>
                  {/* <span className="text-xs opacity-70 shrink-0 select-none">{isOpen ? 'Hide' : 'Show'}</span> */}
                </div>
              )}
            </Card>
            {isOpen && (
              <div className="pl-2 text-xs opacity-70 flex gap-3">
                <span>Priority: {r.priority}</span>
                <span>Status: {r.completed ? 'Completed' : 'Open'}</span>
                <span>Updated: {new Date(r.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="opacity-70 text-sm">No recipes match your query.</div>
      )}
    </div>
  );
}
