import { useAuth } from "@/app/providers/auth";
import { ThemedView } from "@/shared/components/themed-view";
import { View, Text, StyleSheet, Button } from "react-native";

export default function TestLoginPage() {
  const { signIn } = useAuth()
  return (

    <View style={styles.screenStack}>
      <Text>Login</Text>
      <Button title="Sign in with google" onPress={signIn} />
    </View>
  )
}

const styles = StyleSheet.create({
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
