import { useEffect, useState } from 'react';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type Session = {
  status: AuthStatus;
  user: null | { id: string; email?: string };
};

export function useAuthSession(): Session {
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Placeholder restore logic. We'll wire JWT + storage next.
  useEffect(() => {
    // Simulate async restore; default to unauthenticated for now.
    const t = setTimeout(() => setStatus('unauthenticated'), 0);
    return () => clearTimeout(t);
  }, []);

  return { status, user: null };
}

