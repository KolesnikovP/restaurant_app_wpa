import { TAuthUser } from '@/entities/authUser';
import { AuthError } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

interface TAuthContext {
  user: TAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, userData: TAuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  error: AuthError | null;
}

const AuthContext = React.createContext<TAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<TAuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true);  // Changed to true
  const [error, setError] = React.useState<AuthError | null>(null)
  const router = useRouter()

  // Check if user has token on app start
  React.useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const email = await SecureStore.getItemAsync('userEmail');
      const name = await SecureStore.getItemAsync('userName');
      const id = await SecureStore.getItemAsync('userId');  // ADD THIS

      if (token && email && name && id) {
        setUser({ id, email, name });
      }
    } catch (error) {
      console.log('Error loading auth:', error);
      setError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token: string, userData: TAuthUser) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Save to secure storage
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('userEmail', userData.email);
      await SecureStore.setItemAsync('userName', userData.name);
      await SecureStore.setItemAsync('userId', userData.id);  // ADD THIS

      // Update state
      setUser({ id: userData.id, email: userData.email, name: userData.name });
    } catch (error) {
      console.log('Error signing in:', error);
      setError(error as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear secure storage
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('userId');

      // Clear state
      setUser(null);
      setError(null);
      
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      console.log('Error signing out:', error);
      setError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const initData = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
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
