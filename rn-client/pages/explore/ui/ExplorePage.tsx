import { Image } from 'expo-image';
import { Alert, Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@shared/components/ui/collapsible';
import { ExternalLink } from '@shared/components/external-link';
import ParallaxScrollView from '@shared/components/parallax-scroll-view';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { IconSymbol } from '@shared/components/ui/icon-symbol';
import { Fonts } from '@shared/constants/theme';
import { DevHelpCleanSecureStoreButton } from '@/shared/devHelpers/components/DevHelpCleanSecureStoreButton';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { createEnvironment } from '@/features/createEnvironment/services/createEnvironment';
import { useState } from 'react';
import { TEnvironment } from '@/entities/environment/environment';
import { getEnvironments } from '@/features/getEnvironments/getEnvironments';

export function ExplorePage() {
  const { signOut, user } = useAuth()
  
  const handleCreateEnvironment = async () => {
    const fakeID = 'a3f8b2c7-4d91-4e3a-9b5f-2c8e7d6a1f4b'
    console.log('call func >>> ', user)
    const result = await createEnvironment('RESTAURANT', 'restaurant description')
if (result) {
      Alert.alert('success >??', result.name)
    }
  }

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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
        <DevHelpCleanSecureStoreButton />
        <AppButton
          onPress={signOut}
          title={"LogOut"}  // Show loading state
          size="medium"
        />

        <AppButton onPress={handleCreateEnvironment} title="Create Test Environment" />
        <AppButton onPress={handleGetEnvironments} title="get Test Environment" />
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@shared/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
