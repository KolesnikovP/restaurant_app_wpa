import { Image } from 'expo-image';
import { Alert, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@shared/components/hello-wave';
import ParallaxScrollView from '@shared/components/parallax-scroll-view';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { Link } from 'expo-router';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { DevHelpCleanSecureStoreButton } from '@/shared/devHelpers/components/DevHelpCleanSecureStoreButton';
import { createEnvironment } from '@/features/createEnvironment/services/createEnvironment';

export function HomePage() {
  const { signOut, user } = useAuth()

  const handleCreateEnvironment = async () => {
    const fakeID = 'a3f8b2c7-4d91-4e3a-9b5f-2c8e7d6a1f4b'
    console.log('call func >>> ', user)
    const result = await createEnvironment('amazing title', 'amazing description')

    if (result) {
      Alert.alert('success >??', result.name)
    }

  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@shared/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedText>{JSON.stringify(user)}</ThemedText>
      <DevHelpCleanSecureStoreButton />
      <AppButton
        onPress={signOut}
        title={"LogOut"}  // Show loading state
        size="medium"
      />

      <AppButton onPress={handleCreateEnvironment} title="Create Test Environment" />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
