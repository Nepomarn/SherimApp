import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';

interface GlassCardProps extends ViewProps {
  children: ReactNode;
  intensity?: number;
}

export default function GlassCard({ children, intensity = 20, style, ...props }: GlassCardProps) {
  return (
    <View
      style={[
        {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: 'rgba(26, 31, 58, 0.7)',
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 32,
          elevation: 8,
        },
        style,
      ]}
      {...props}
    >
      <BlurView intensity={intensity} tint="dark" style={{ flex: 1 }}>
        {children}
      </BlurView>
    </View>
  );
}
