import { PropsWithChildren } from 'react';
import { Pressable, View, Text } from 'react-native';

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}>;

export function Card({ children, title, subtitle, onPress }: CardProps) {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
      }}
    >
      {(title || subtitle) && (
        <View style={{ marginBottom: children ? 8 : 0 }}>
          {title ? (
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{title}</Text>
          ) : null}
          {subtitle ? (
            <Text style={{ color: '#a3a3a3', fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
          ) : null}
        </View>
      )}
      {children}
    </Container>
  );
}
