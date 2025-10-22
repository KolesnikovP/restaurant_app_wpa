import { TAuthUser } from '@/entities/authUser';
import { AuthError } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { postGoogleIdToken } from '@/features/auth/api/mobileAuth';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = React.createContext({
  user: null,
  signIn: () => { },
  signOut: () => { },
  fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
})

// Using native Google id_token flow; no web authorize/callback on mobile.

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = React.useState<TAuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null)

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClient: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
    responseType: 'id_token',
    scopes: ['openid', 'email', 'profile'],
  });

  const signIn = async () => {
      console.log('>>> here signIN')
    try {
      if (!request) {
        console.log('no request')
        return;
      }
      console.log('here, ', request.url)
      const res = await promptAsync({ useProxy: true, showInRecents: true });
      if (res.type !== 'success') return;
      setIsLoading(true);
      const idToken = (res as any)?.params?.id_token || (res as any)?.authentication?.idToken;
      if (!idToken) throw new Error('No id_token from Google');
      const data = await postGoogleIdToken(idToken);
      await SecureStore.setItemAsync('auth_token', data.token);
      setUser({ id: data.user.id, name: data.user.name, email: data.user.email } as TAuthUser);
    } catch (e) {
      console.log(e)
      setError(e as AuthError);
    } finally {
      setIsLoading(false);
    }
  }

  const signOut = async () => { }

  const fetchWithAuth = async (url: string, options?: RequestInit) => { }

  const initData = {
    user,
    signIn,
    signOut,
    fetchWithAuth,
    isLoading,
    error,
  }

  return <AuthContext.Provider value={initData}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
}
