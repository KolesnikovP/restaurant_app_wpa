import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './providers/auth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// Protected routes wrapper
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait until we check storage

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // User logged in but on login page, redirect to home
      router.replace('/home');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
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
