import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Modal, TouchableOpacity, useColorScheme, View, StyleSheet, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { createEnvironment } from '@/features/createEnvironment/services/createEnvironment';
import { useAuth } from '../providers/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [selectedValue, setSelectedValue] = useState('All');
  const options = [
    { label: 'All', value: 'All' },
    { label: 'Environment 1', value: 'Environment 1' },
    { label: 'Environment 2', value: 'Environment 2' }
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: () => (
            <HeaderSelect
              value={selectedValue}
              onChange={setSelectedValue}
              options={options}
            />
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function HeaderSelect({ value, onChange, options }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={() => setVisible(true)}>
        <Text style={styles.headerSelect}>{value} </Text>
        <Ionicons name="albums" size={25} color={'black'} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSelect: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100
  },
  dropdown: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 8
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});

