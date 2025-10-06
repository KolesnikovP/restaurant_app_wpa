import { PropsWithChildren, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: PropsWithChildren) {
  const clientRef = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return <QueryClientProvider client={clientRef.current}>{children}</QueryClientProvider>;
}
