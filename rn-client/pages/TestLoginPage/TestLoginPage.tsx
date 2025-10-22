import { useAuth } from "@/app/providers/auth";
import { ThemedText } from "@/shared/components/themed-text";
import { AppButton } from "@/shared/components/ui/app-button";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, Button, TextInput } from "react-native";

export default function TestLoginPage() {
  const { signIn } = useAuth()
  const [loginValue, setLoginValue] = useState<string>('')
  const [passwodValue, setPasswordValue] = useState<string>('')

  const handleSubmit = () => {
    console.log(loginValue, passwodValue)
  }

  return (
    <View style={styles.screenStack}>
      <ThemedText type="title">Login</ThemedText>
      <TextInput
        style={styles.input}
        value={loginValue}
        onChangeText={setLoginValue}
        placeholder="login"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        value={passwodValue}
        onChangeText={setPasswordValue}
        secureTextEntry
      />

      <AppButton
        onPress={handleSubmit}
        title="login"
        size="medium"
      />
      
      <Text>Login</Text>
      <Button title="Sign in with google" onPress={signIn} />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 7,
    width: '70%',
    borderWidth: 1,
    margin: 12,
  },
  screenStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
