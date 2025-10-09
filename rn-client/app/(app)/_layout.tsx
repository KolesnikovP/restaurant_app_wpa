import { Redirect, Stack } from 'expo-router';
import { useAuthSession } from '@/features/auth/model/useAuthSession';

export default function AppLayout() {
  const { status } = useAuthSession();

  if (status === 'loading') return null;
  if (status !== 'authenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}
