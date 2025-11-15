import { BASE_URL } from "@/shared/constants/constants"
import * as SecureStore from 'expo-secure-store'
import { Alert } from "react-native"

export const createEnvironment = async (name: string, description: string) => {

  try {
    const token = await SecureStore.getItemAsync('authToken')

    if (!token) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    const response = await fetch(BASE_URL + '/create_environment', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
      })
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Create environment failed:', errorText);
      Alert.alert('Error', 'Failed to create environment');
      return;
    }

    const json = await response.json();
    console.log('Environment created:', json);
    return json; // Return the created environment

  } catch (error) {
    console.log('Error:', error)
    Alert.alert('Error', 'Something went wrong')
  }

}
