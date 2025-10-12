import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons';
import { TextField } from '@shared/components/ui/text-field';
import { AppButton } from '@shared/components/ui/app-button';

// Complete pending auth sessions (recommended at module scope)
WebBrowser.maybeCompleteAuthSession();

export function LoginPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
    responseType: 'id_token',
    scopes: ['openid', 'email', 'profile'],
  });

  const onLogin = () => {
    // TODO: wire to auth feature
    console.log('Login pressed', { email });
  };

  const onLoginWithGoogle = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
    // Sanity-check client IDs in dev
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID && Platform.OS === 'web') {
      console.warn('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
    }
    if (Platform.OS === 'ios' && !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
      console.warn('Missing EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID');
    }
    if (Platform.OS === 'android' && !process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID) {
      console.warn('Missing EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID');
    }

    try {
      const res = await promptAsync({ useProxy: true, showInRecents: true });
      if (res.type !== 'success') {
        console.log('Google auth cancelled or failed', res.type);
        return;
      }
      const idToken = (res as any)?.params?.id_token || (res as any)?.authentication?.idToken;
      if (!idToken) {
        Alert.alert('Login failed', 'No ID token returned.');
        return;
      }
      const resp = await fetch(`${baseUrl}/auth/google/mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Backend error', resp.status, text);
        Alert.alert('Login failed', `Server error ${resp.status}`);
        return;
      }
      const data = await resp.json();
      console.log('Login success:', data);
      // TODO: persist session (e.g., SecureStore) and update auth state
    } catch (err) {
      console.error('err fetching data ' + err);
      Alert.alert('Login failed', String(err));
    }
  };

  const isValid = email.trim().length > 0 && password.length > 0;
  const tint = Colors[colorScheme].tint;
  const borderColor = Colors[colorScheme].icon;

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
      >
        <View style={styles.screenStack}>
          <View style={styles.topSection}>
            <ThemedText type="title" style={styles.title}>
              Log in
            </ThemedText>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholderTextColor={borderColor}
            />
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              textContentType="password"
              placeholderTextColor={borderColor}
            />
            <AppButton title="LOG IN" onPress={onLogin} disabled={!isValid} variant="primary" />
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.separatorRow}>
              <View style={[styles.separatorLine, { backgroundColor: borderColor }]} />
              <ThemedText style={styles.separatorText}>LOGIN WITH</ThemedText>
              <View style={[styles.separatorLine, { backgroundColor: borderColor }]} />
            </View>
            <AppButton
              title="Continue with Google"
              onPress={onLoginWithGoogle}
              variant="outline"
              leftIcon={<FontAwesome name="google" size={18} color={tint} style={{ marginRight: 8 }} />}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screenStack: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 6,
  },
  topSection: {
    gap: 12,
  },
  bottomSection: {
    gap: 14,
    marginBottom: 24,
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  separatorLine: {
    height: 1,
    flex: 1,
    opacity: 0.4,
  },
  separatorText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
