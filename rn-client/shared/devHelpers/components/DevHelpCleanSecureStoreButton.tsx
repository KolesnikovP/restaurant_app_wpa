import { AppButton } from "@/shared/components/ui/app-button";
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native";

export const DevHelpCleanSecureStoreButton = () => {
  const simulateFreshInstall = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userEmail');
    await SecureStore.deleteItemAsync('userName');
    await SecureStore.deleteItemAsync('userId');

    // Force reload the app
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      // On native, you need to manually restart
      alert('Auth cleared! Close and reopen the app to see fresh install experience.');
    }
  };

  return (
    <AppButton
      onPress={simulateFreshInstall}
      title="Simulate Fresh Install (Dev Only)"
      size="medium"
    />

  )
}
