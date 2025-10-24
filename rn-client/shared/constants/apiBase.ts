import { Platform } from 'react-native';

// Determine a sensible dev default when EXPO_PUBLIC_API_URL is not set
export function getApiBaseUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env && env.trim()) return env.replace(/\/$/, '');
  // Fallbacks for local dev
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
  return 'http://localhost:8080';
}

