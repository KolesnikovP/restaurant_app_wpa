import { FlatList, View, Text, Pressable } from 'react-native';
import { useGetMenuItems } from '@/features/menuItems/api/useGetMenuItems';
import { Card } from '@/shared/ui/Card';

type Props = { query?: string; onPressItem?: (id: number) => void };

export default function MenuList({ query = '', onPressItem }: Props) {
  const { data, isPending, error } = useGetMenuItems();
  const filtered = data.filter((i) => {
    const hay = (i.name + ' ' + i.category + ' ' + i.ingredients.join(' ')).toLowerCase();
    return query.trim().length === 0 ? true : hay.includes(query.toLowerCase());
  });

  if (isPending) return <Text style={{ color: '#cbd5e1' }}>Loading menu…</Text>;
  if (error) return <Text style={{ color: '#fca5a5' }}>Failed to load menu</Text>;

  if (!filtered.length) {
    return (
      <Card>
        <Text style={{ color: '#cbd5e1' }}>No menu items</Text>
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
          title={item.name}
          subtitle={item.category}
        >
          {item.ingredients?.length ? (
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {item.ingredients.join(' • ')}
            </Text>
          ) : null}
        </Card>
      )}
    />
  );
}
