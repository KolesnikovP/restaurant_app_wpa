import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { Colors } from '@shared/constants/theme';
import { useColorScheme } from '@shared/hooks/use-color-scheme';

type Variant = 'primary' | 'outline';

export type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large"
};

export function AppButton({ title, onPress, disabled, size = 'large',variant = 'primary', leftIcon, style }: AppButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const tint = Colors[scheme].tint;
  const borderColor = Colors[scheme].icon;
  const textColor = Colors[scheme].text;
  
  const windowWidth = Dimensions.get('window').width

  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={({ pressed }) => [
        styles.base,
        size === "large" && {width: windowWidth * 0.9},
        size === "medium" && {width: windowWidth * 0.6},
        size === "small" && {width: windowWidth * 0.3},
        variant === 'primary' && { backgroundColor: tint },
        variant === 'outline' && {
          backgroundColor: scheme === 'dark' ? '#121415' : '#FFFFFF',
          borderWidth: 1,
          borderColor,
        },
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          styles.text,
          variant === 'primary' ? { color: '#fff' } : { color: textColor },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

