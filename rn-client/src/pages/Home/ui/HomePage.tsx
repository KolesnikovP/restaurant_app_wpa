import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import MenuList from '@/features/menuItems/ui/MenuList';
import RecipesList from '@/features/recipes/ui/RecipesList';
import { useQueryClient } from '@tanstack/react-query';
import { fetchMenuItems } from '@/features/menuItems/api/useGetMenuItems';
import { fetchRecipes } from '@/features/recipes/api/useGetRecipes';
import { TextInput } from 'react-native';
import DetailModal from '@/pages/Detail/ui/DetailModal';
import GuidelinesPage from '@/pages/Guidelines/ui/GuidelinesPage';

type TabKey = 'menu' | 'recipes' | 'guidelines';

export default function HomePage() {
  const [tab, setTab] = useState<TabKey>('menu');
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<{ type: 'menu' | 'recipe' | null; id: number | null }>({ type: null, id: null });
  const qc = useQueryClient();

  const prefetch = useCallback((key: TabKey) => {
    if (key === 'menu') {
      qc.prefetchQuery({ queryKey: ['menuItems'], queryFn: fetchMenuItems, staleTime: 30_000 });
    } else {
      qc.prefetchQuery({ queryKey: ['recipesData'], queryFn: fetchRecipes, staleTime: 30_000 });
    }
  }, [qc]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Restaurant App</Text>
        <Text style={{ color: '#94a3b8', marginTop: 2 }}>Mobile Client</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 }}>
        <TabButton
          active={tab === 'menu'}
          onPress={() => setTab('menu')}
          onPressIn={() => prefetch('menu')}
          label="Menu Items"
        />
        <TabButton
          active={tab === 'recipes'}
          onPress={() => setTab('recipes')}
          onPressIn={() => prefetch('recipes')}
          label="Recipes"
        />
        <TabButton
          active={tab === 'guidelines'}
          onPress={() => setTab('guidelines')}
          label="Guidelines"
        />
      </View>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#64748b"
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: '#111827',
            borderColor: '#1f2937',
            borderWidth: 1,
            color: '#fff',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'menu' && (
          <MenuList query={query} onPressItem={(id) => setDetail({ type: 'menu', id })} />
        )}
        {tab === 'recipes' && (
          <RecipesList query={query} onPressItem={(id) => setDetail({ type: 'recipe', id })} />
        )}
        {tab === 'guidelines' && (
          <GuidelinesPage />
        )}
      </View>

      <DetailModal
        visible={detail.type != null}
        type={detail.type}
        id={detail.id}
        onClose={() => setDetail({ type: null, id: null })}
      />
    </View>
  );
}

function TabButton({ active, onPress, onPressIn, label }: { active: boolean; onPress: () => void; onPressIn?: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={onPressIn}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? '#2563eb' : '#111827',
        borderColor: '#1f2937',
        borderWidth: 1,
      }}
    >
      <Text style={{ color: active ? '#fff' : '#cbd5e1', fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
