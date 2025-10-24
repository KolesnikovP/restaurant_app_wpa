import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@shared/components/hello-wave';
import ParallaxScrollView from '@shared/components/parallax-scroll-view';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { Link } from 'expo-router';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import * as SecureStore from 'expo-secure-store';

export function HomePage() {
  const { signOut, user } = useAuth()

  const simulateFreshInstall = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userEmail');
    await SecureStore.deleteItemAsync('userName');
    await SecureStore.deleteItemAsync('userId');

    // Force reload the app
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      // On native, you need to manually restart
      alert('Auth cleared! Close and reopen the app to see fresh install experience.');
    }
  };
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
      <AppButton
        onPress={signOut}
        title={"LogOut"}  // Show loading state
        size="medium"
      />
      <AppButton
        onPress={simulateFreshInstall}
        title="Simulate Fresh Install (Dev Only)"
        size="medium"
      />
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
