import { TAuthUser } from '@/entities/authUser';
import { BASE_URL } from '@/shared/constants/constants';
import { AuthError, AuthRequestConfig, DiscoveryDocument, exchangeCodeAsync, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = React.createContext({
  user: null,
  signIn: () => { },
  signOut: () => { },
  fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
})

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const appleConfig: AuthRequestConfig = {
  clientId: "apple",
  scopes: ["name", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  // authorizationEndpoint: 'http://localhost:8080/auth/google/login',
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

const appleDiscovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/apple/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/apple/token`,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = React.useState<TAuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null)

  const [request, response, promptAsync] = useAuthRequest(config, discovery)
  const isWeb = Platform.OS === 'web'
  React.useEffect(() => {
    handleResponse()
  }, [response])

  const handleResponse = async () => {
    if (response?.type === "success") {
      const { code } = response.params

      try {
        setIsLoading(true)

        const tokenResponse = await exchangeCodeAsync(
          {
            code: code,
            extraParams: {
              platform: Platform.OS,
            },
            clientId: 'google',
            redirectUri: makeRedirectUri(),

          },
          discovery
        )

        console.log('token response', tokenResponse)

        if(isWeb) {
          const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            method: "GET",
            credentials: "include"
          })
        if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json()
            setUser(sessionData as TAuthUser)
          }
        } else {
          const accessToken = tokenResponse.accessToken;

          setAccessToken(accessToken)


          // save toke to local storage
          tokenCahe?.saveToken(TOKEN_KEY_NAME, accessToken)

          console.log(accessToken)

          // get user info
          const decoded = jose.decodeJwt(accessToken)
          setUser(decoded as AuthUser);
        }

      } catch (e) {
        console.log()
      } finally {
        setIsLoading(false)
      }

      console.log(code)
    } else if (response?.type === "error") {
      setError(response.error as AuthError)
    }
  }

  const signIn = async () => {
    try {
      if (!request) {
        console.log('no request')
        return;
      }
      await promptAsync();
    } catch (e) {
      console.log(e)
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
