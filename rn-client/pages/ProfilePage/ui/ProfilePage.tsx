import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/shared/components/themed-text';
import { AppButton } from '@/shared/components/ui/app-button';
import { useAuth } from '@/app/providers/auth';
import { useRouter } from 'expo-router';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText>Email: {user?.email}</ThemedText>
      <ThemedText>Name: {user?.name}</ThemedText>
      
      <AppButton
        onPress={handleLogout}
        title="Log Out"
        size="medium"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
