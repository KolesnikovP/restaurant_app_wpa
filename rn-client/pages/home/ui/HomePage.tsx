import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { getEnvironments } from '@/features/getEnvironments/getEnvironments';
import { useEffect, useState } from 'react';
import { TEnvironment } from '@/entities/environment/environment';
import { DropdownPicker } from './DropdownPicker';
import { TCategory } from '@/entities/category/category';
import { getEnvironmentById } from '@/features/getEnvironmentById/getEnvironmentById';
import { AppModal } from '@/shared/components/ui/AppModal/AppModal';
import { CreateCategoryForm } from '@/features/createCategory';

export function HomePage() {
  const { user } = useAuth();
  const [selectedEnvId, setSelectedEnvId] = useState<string>('');
  const [environments, setEnvironments] = useState<TEnvironment[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("USER >>> ", user)
  console.log("ENV ID>>>", selectedEnvId)
  // Load all environments on mount
  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = async () => {
    setLoading(true);
    try {
      const envs = await getEnvironments();
      console.log("LOAD ENV >>>", envs)
      if (envs && envs.length > 0) {
        setEnvironments(envs);
        // Load first environment with categories
        await loadEnvironmentWithCategories(envs[0].id);
      }
    } catch (error) {
      console.error('Error loading environments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnvironmentWithCategories = async (envId: string) => {
    try {
      // Use the endpoint that returns environment WITH categories
      const envWithCategories = await getEnvironmentById(envId);
      if (envWithCategories) {
        setSelectedEnvId(envId);
        setCategories(envWithCategories.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleEnvironmentChange = async (envId: string) => {
    // Load new environment's categories when user switches
    await loadEnvironmentWithCategories(envId);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (environments.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No environments found</ThemedText>
        <ThemedText>Create your first restaurant!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>

      <DropdownPicker
        items={environments.map(env => ({
          label: env.name,
          value: env.id,
          key: env.id
        }))}
        selectedValue={selectedEnvId}
        onValueChange={handleEnvironmentChange}  // Load categories on change
        placeholder='Select an environment'
        style={styles.dropdown}
      />

      <View style={styles.categoriesContainer}>
        {categories.length > 0 ? (
          <>
            <View style={styles.categoryHeader}>
              <ThemedText type="subtitle">Categories</ThemedText>
              <View>
                <AppButton
                  size='small'
                  // style={styles.button}
                  title={"Modal"}
                  onPress={() => setIsModalOpen(true)}
                />
                <AppModal 
                  visible={isModalOpen}
                  onModalOpen={() => { }}
                  onModalClose={() => setIsModalOpen(false)}
                >
                  <ThemedText type="subtitle">Categories</ThemedText>
                  <CreateCategoryForm
                    environmentId={selectedEnvId}
                    
                    onSubmit={() => setIsModalOpen(false)}
                  />
                </AppModal>
              </View>
            </View>
            {categories.map(category => (
              <AppButton
                style={styles.categoryButton}
                title={category.name}
                key={category.id}
                onPress={() => {
                  // TODO: Navigate to items list for this category
                  console.log('Navigate to category:', category.id);
                }}
              />
            ))}
          </>
        ) : (
          <>
            <View style={styles.categoryHeader}>
              <ThemedText type="subtitle">Categories</ThemedText>
              <View>
                <AppButton
                  size='small'
                  // style={styles.button}
                  title={"Modal"}
                  onPress={() => setIsModalOpen(true)}
                />
                <AppModal
                  visible={isModalOpen}
                  onModalOpen={() => { }}
                  onModalClose={() => { }}
                >
                  <ThemedText type="subtitle">Categories</ThemedText>
                  <CreateCategoryForm environmentId={selectedEnvId} />
                </AppModal>
              </View>
            </View>
            <ThemedText>No categories yet. Add some categories!</ThemedText>
          </>
        )}
      </View>
      <ThemedText>Welcome, {"\n " + user?.name + "\n " + user?.id + "\n " + user?.email}!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  categoryHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  createButton: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  dropdown: {
    width: '100%',
  },
  categoriesContainer: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  categoryButton: {
    marginBottom: 10,
  },
});
