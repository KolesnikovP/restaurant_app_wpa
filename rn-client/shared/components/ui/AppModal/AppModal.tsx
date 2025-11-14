import { StyleSheet, View, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { ThemedText } from '@shared/components/themed-text';
import { ReactNode, useState } from 'react';
import { AppButton } from '../app-button';
import { IconSymbol } from '../icon-symbol';

interface AppModalProps {
  placeholder?: string;
  onModalOpen: () => void,
  onModalClose: () => void,
  style?: any;
  children?: ReactNode;
}

export function AppModal({
  onModalOpen,
  onModalClose,
  placeholder = '+',
  children,
  style,
}: AppModalProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const onModalOpenHandler = () => {
    setModalVisible(true)
    onModalOpen()
  }

  const onModalCloseHandler = () => {
    setModalVisible(false)
    onModalClose()
  }

  return (
    <View style={style}>
      {/* Dropdown Trigger */}
      <AppButton
        size='small'
        style={styles.button}
        title={placeholder}
        onPress={onModalOpenHandler}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={onModalCloseHandler}
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
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
  },
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

