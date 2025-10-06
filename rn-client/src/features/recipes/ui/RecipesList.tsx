import { FlatList, View, Text } from 'react-native';
import { useGetRecipes } from '@/features/recipes/api/useGetRecipes';
import { RecipeCard } from './RecipeCard';
import { Card } from '@/shared/ui/Card';

type Props = { query?: string; onPressItem?: (id: number) => void };

export default function RecipesList({ query = '', onPressItem }: Props) {
  const { data, isPending, error } = useGetRecipes();
  const filtered = data.filter((r) =>
    query.trim().length === 0
      ? true
      : (r.recipe_name + ' ' + (r.description ?? '')).toLowerCase().includes(query.toLowerCase())
  );

  if (isPending) return <Text style={{ color: '#cbd5e1' }}>Loading recipes…</Text>;
  if (error) return <Text style={{ color: '#fca5a5' }}>Failed to load recipes</Text>;

  if (!filtered.length) {
    return (
      <Card>
        <Text style={{ color: '#cbd5e1' }}>No recipes</Text>
      </Card>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ gap: 12, paddingBottom: 24, paddingHorizontal: 16 }}
      data={filtered}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Card
          onPress={onPressItem ? () => onPressItem(item.id) : undefined}
          title={item.recipe_name}
          subtitle={`Shelf life: ${item.shelf_life || '—'}`}
        >
          {item.description?.length ? (
            <Text style={{ color: '#cbd5e1', fontSize: 13 }} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </Card>
      )}
    />
  );
}
