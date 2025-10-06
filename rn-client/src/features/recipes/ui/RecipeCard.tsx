import { View, Text } from 'react-native';
import type { TRecipe } from '@/entities/recipe';
import { Card } from '@/shared/ui/Card';

type Props = {
  recipe: TRecipe;
};

export function RecipeCard({ recipe }: Props) {
  return (
    <Card>
      <View style={{ gap: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{recipe.recipe_name}</Text>
        {recipe.description?.length ? (
          <Text style={{ color: '#cbd5e1', fontSize: 13 }}>
            {recipe.description}
          </Text>
        ) : null}
        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Shelf life: {recipe.shelf_life || '—'}</Text>
      </View>
    </Card>
  );
}

