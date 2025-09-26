import { Card } from "@/shared/ui/Card";
import type { TRecipe } from "@/entities/recipe";

type Props = {
  recipe: TRecipe;
  onClose: () => void;
};

export function RecipeCard({ recipe, onClose }: Props) {
  return (
    <Card title={recipe.recipe_name} subtitle={`Shelf life: ${recipe.shelf_life}`} onClose={onClose}>
      <div className="space-y-2">
        <p className="text-sm whitespace-pre-wrap">{recipe.description}</p>
        <div className="text-xs opacity-70 flex gap-3">
          <span>Priority: {recipe.priority}</span>
          <span>Status: {recipe.completed ? 'Completed' : 'Open'}</span>
        </div>
      </div>
    </Card>
  );
}
