import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './providers/auth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Not logged in, go to login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Logged in but on login page, go to tabs
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
