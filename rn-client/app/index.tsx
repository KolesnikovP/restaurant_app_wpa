import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/providers/auth';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? '/home' : '/login');
  }, [user, isLoading]);

  return null;
}

