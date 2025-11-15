import { useAuth } from "@/app/providers/auth";
import { ThemedText } from "@/shared/components/themed-text";
import { AppButton } from "@/shared/components/ui/app-button";
import { BASE_URL } from "@/shared/constants/constants";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  
  const [loginValue, setLoginValue] = useState<string>('')
  const [passwordValue, setPasswordValue] = useState<string>('')  // Fixed typo
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const handleSubmit = async () => {
    setIsLoading(true);  
    try {
      const response = await fetch(BASE_URL + "/login", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginValue.toLowerCase(),
          password: passwordValue  
        })
      })
      
      if(!response.ok) {
        Alert.alert('Error', 'Login failed')
        return;
      }
      
      const json = await response.json()
      console.log(json, "M<<<<<<<")
      
      console.log("LOGIN PAGE: ", json.id, "<<<<<<<")

      if(json.token) {
        await signIn(json.token, {
          id: json.id + '',  // Make sure to include id
          email: json.email,
          name: json.name
        })
        console.log("✅ logged in successfully!")
        router.replace('/(tabs)')
      } else {
        console.log("❌ No token received")
        Alert.alert('Error', 'No token received')
      }
    } catch (error) {
      console.log('Error:', error)
      Alert.alert('Error', 'Something went wrong')
    } finally {
      setIsLoading(false); 
    }
  }
  
  return (
    <View style={styles.screenStack}>
      <ThemedText type="title">Login</ThemedText>
      <TextInput
        style={styles.input}
        value={loginValue}
        onChangeText={setLoginValue}
        placeholder="email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        value={passwordValue}  // Fixed typo
        onChangeText={setPasswordValue}
        secureTextEntry
      />
      <AppButton
        onPress={handleSubmit}
        title={isLoading ? "Loading..." : "Login"}  // Show loading state
        size="medium"
        disabled={isLoading}  // Disable while loading
      />
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
  }
});
