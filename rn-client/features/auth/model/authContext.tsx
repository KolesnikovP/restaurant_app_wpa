import React, { createContext, useContext, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { postGoogleIdToken } from '@/features/auth/api/mobileAuth';

WebBrowser.maybeCompleteAuthSession();

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
    responseType: 'id_token',
    scopes: ['openid', 'email', 'profile'],
  });

  const signInWithGoogle = async () => {
    const res = await promptAsync({ useProxy: true, showInRecents: true });
    if (res.type !== 'success') return;
    const idToken = (res as any)?.params?.id_token || (res as any)?.authentication?.idToken;
    if (!idToken) throw new Error('No id_token from Google');
    const { token: appToken, user: appUser } = await postGoogleIdToken(idToken);
    await SecureStore.setItemAsync('auth_token', appToken);
    setToken(appToken);
    setUser({ id: appUser.id, name: appUser.name, email: appUser.email });
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('auth_token');
  };

  const value = useMemo(
    () => ({ user, token, signInWithGoogle, signOut }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

