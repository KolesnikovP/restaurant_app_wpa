import { ActivityIndicator, Button, Text, View } from "react-native";
import { useAuth } from "./providers/auth";
import { LoginPage } from "@/pages/LoginPage";
import TestLoginPage from "@/pages/TestLoginPage/TestLoginPage";

export default function Index() {
  const { user, isLoading, signOut } = useAuth()

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <TestLoginPage />
      </View>
    )
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{JSON.stringify(user)}</Text>
      <Button title='sign out' onPress={() => signOut()}/>
    </View>
  );
}
