import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@shared/components/hello-wave';
import ParallaxScrollView from '@shared/components/parallax-scroll-view';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { Link } from 'expo-router';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { DevHelpCleanSecureStoreButton } from '@/shared/devHelpers/components/DevHelpCleanSecureStoreButton';

export function HomePage() {
  const { signOut, user } = useAuth()

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
      <DevHelpCleanSecureStoreButton/>
      <AppButton
        onPress={signOut}
        title={"LogOut"}  // Show loading state
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
