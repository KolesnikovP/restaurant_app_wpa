
import { TCategory } from "@/entities/category/category"
import { TEnvironment } from "@/entities/environment/environment"
import { GET_ENVIRONMENTS_BY_ID_ENDPOINT } from "@/shared/constants/endpoints"
import * as SecureStore from "expo-secure-store"
import { Alert } from "react-native"

export type TEnvironmentWithCategory = TEnvironment & {categories: TCategory[]}

export const getEnvironmentById = async (environmentID: string): Promise<TEnvironmentWithCategory | undefined>  => {
  try {
    const token = await SecureStore.getItemAsync('authToken')
    if (!token) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    const response = await fetch(GET_ENVIRONMENTS_BY_ID_ENDPOINT(environmentID), {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.log('token >>>>', token)
      const errorText = await response.text();
      console.log('get environment failed: >>>', errorText);
      Alert.alert('Error', 'Failed to get environments');
      return;
    }

     
    const json = await response.json();
    console.log('Environment get: ', json);
    return json; // Return the created environment
  } catch (error) {
    console.log('Error:', error)
    Alert.alert('Error', 'Something went wrong')
  }
}
