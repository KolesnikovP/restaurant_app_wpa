import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { ThemedView } from '@shared/components/themed-view';
import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons';
import { TextField } from '@shared/components/ui/text-field';
import { AppButton } from '@shared/components/ui/app-button';

export function LoginPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onLogin = () => {
    // TODO: wire to auth feature
    console.log('Login pressed', { email });
  };

  const onLoginWithGoogle = () => {
    // TODO: integrate Google auth
    console.log('Login with Google');
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
