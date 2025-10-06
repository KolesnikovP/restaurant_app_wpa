import { Modal, View, Text, Pressable } from 'react-native';
import { useGetMenuItems } from '@/features/menuItems/api/useGetMenuItems';
import { useGetRecipes } from '@/features/recipes/api/useGetRecipes';
import { Card } from '@/shared/ui/Card';

type Props = {
  visible: boolean;
  onClose: () => void;
  type: 'menu' | 'recipe' | null;
  id: number | null;
};

export default function DetailModal({ visible, onClose, type, id }: Props) {
  const { data: menuItems } = useGetMenuItems();
  const { data: recipes } = useGetRecipes();

  let content: JSX.Element | null = null;
  if (type === 'menu' && id != null) {
    const item = menuItems.find((m) => m.id === id);
    if (item) {
      content = (
        <Card title={item.name} subtitle={item.category}>
          {item.ingredients?.length ? (
            <View style={{ gap: 4 }}>
              {item.ingredients.map((ing, idx) => (
                <Text key={idx} style={{ color: '#cbd5e1', fontSize: 13 }}>
                  • {ing}
                </Text>
              ))}
            </View>
          ) : null}
        </Card>
      );
    }
  }
  if (type === 'recipe' && id != null) {
    const r = recipes.find((m) => m.id === id);
    if (r) {
      content = (
        <Card title={r.recipe_name} subtitle={`Shelf life: ${r.shelf_life || '—'}`}>
          {r.description?.length ? (
            <Text style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 18 }}>
              {r.description}
            </Text>
          ) : null}
          <View style={{ marginTop: 8, flexDirection: 'row', gap: 12 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Priority: {r.priority}</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Status: {r.completed ? 'Completed' : 'Open'}</Text>
          </View>
        </Card>
      );
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#0f0f0f', padding: 16, paddingBottom: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Details</Text>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ color: '#93c5fd' }}>Close</Text>
            </Pressable>
          </View>
          {content || <Text style={{ color: '#cbd5e1' }}>Not found.</Text>}
        </View>
      </View>
    </Modal>
  );
}

