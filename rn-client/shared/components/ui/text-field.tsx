import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

export type TextFieldProps = RNTextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const TextField = forwardRef<RNTextInput, TextFieldProps>(
  ({ containerStyle, inputStyle, placeholderTextColor, style, ...props }, ref) => {
    const scheme = useColorScheme() ?? 'light';
    const borderColor = Colors[scheme].icon;
    const textColor = Colors[scheme].text;
    const inputBg = scheme === 'dark' ? '#1C1F20' : '#F3F4F6';

    return (
      <View style={[styles.wrap, { borderColor, backgroundColor: inputBg }, containerStyle]}>
        <RNTextInput
          ref={ref}
          placeholderTextColor={placeholderTextColor ?? borderColor}
          style={[styles.input, { color: textColor }, inputStyle ?? style]}
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 10 }),
  },
  input: {
    fontSize: 16,
  },
});

