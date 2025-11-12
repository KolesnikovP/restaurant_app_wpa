import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { getEnvironments } from '@/features/getEnvironments/getEnvironments';
import { useEffect, useState } from 'react';
import { TEnvironment } from '@/entities/environment/environment';

export function HomePage() {
  const { user } = useAuth()

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [environments, setEnvironments] = useState<TEnvironment[]>([])

  const handleGetEnvironments = async () => {
    const result = await getEnvironments()

    if (result) {
      setEnvironments(result)
      setSelectedValue(result[0].name)
      // console.log(environments[0].description, 'console log !!!!!!!!')
    }
  }

  useEffect(() => {
    handleGetEnvironments()
  }, [])

  if (environments.length > 0) {

    return (
      <ThemedView style={styles.container}>
        <ThemedText>{JSON.stringify(user)}</ThemedText>
        <View>
          {environments.map(item => (
            <AppButton
              style={styles.item}
              key={item.id}
              title={item.name}
              onPress={() => { }}
            />
          ))}
        </View>
      </ThemedView>
    );
  }
  return (
    <ThemedText> loading ...</ThemedText>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  item: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
