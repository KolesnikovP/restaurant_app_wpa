import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";
import { QueryProvider } from "@/appRoot/providers/QueryProvider";
import HomePage from "@/pages/Home/ui/HomePage";

export default function App() {
  const scheme = useColorScheme();
  const dark = scheme !== 'light';
  return (
    <QueryProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: dark ? '#1a1a1a' : '#f5f5f5' }}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1 }}>
          <HomePage />
        </View>
      </SafeAreaView>
    </QueryProvider>
  );
}
