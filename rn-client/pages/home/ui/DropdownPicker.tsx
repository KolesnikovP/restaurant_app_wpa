import { StyleSheet, View, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { useState } from 'react';

interface DropdownItem {
  label: string;
  value: string;
  key: string;
}

interface DropdownPickerProps {
  items: DropdownItem[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export function DropdownPicker({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  style,
}: DropdownPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder;

  return (
    <View style={style}>
      {/* Dropdown Trigger */}
      <Pressable
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.dropdownText}>
          {selectedLabel}
        </ThemedText>
        <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
      </Pressable>

      {/* Modal Picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Option</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={item => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedValue === item.value && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <ThemedText style={styles.modalItemText}>{item.label}</ThemedText>
                  {selectedValue === item.value && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  modalItemText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
