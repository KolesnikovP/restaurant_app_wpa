import { BASE_URL } from "@/shared/constants/constants"
import { CREATE_CATEGORY_ENDPOINT } from "@/shared/constants/endpoints"
import * as SecureStore from 'expo-secure-store'
import { Alert } from "react-native"

export const createCategory = async (envId: string, categoryName: string, icon?: '') => {

  console.log('createCategory FUNC >>>', envId, categoryName)
  try {
    const token = await SecureStore.getItemAsync('authToken')

    if (!token) {
      Alert.alert('Error', 'you must be logged in')
      return
    }
    console.log('ENDPOINT FOR CATEGORY >>>', CREATE_CATEGORY_ENDPOINT(envId))

    const response = await fetch(CREATE_CATEGORY_ENDPOINT(envId), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: categoryName
      })
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Create category failed:', errorText);
      Alert.alert('Error', 'Failed to create category');
      return;
    }

    const json = await response.json();
    console.log('category created:', json);
    return json; // Return the created environment

  } catch (error) {
    console.log('Error:', error)
    Alert.alert('Error', 'Something went wrong')
  }
}


