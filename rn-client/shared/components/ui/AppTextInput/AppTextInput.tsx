import { TextInput, TextInputProps, StyleSheet } from "react-native"

// type AppTextInputProps = {} & TextInputProps
export const AppTextInput = (props: TextInputProps) => {
  return (
      <TextInput
        style={styles.input}
      {...props}
      />
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 7,
    width: '70%',
    borderWidth: 1,
    margin: 12,
  },
  screenStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
