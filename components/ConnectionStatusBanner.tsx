import { View, Text } from 'react-native';
import { Wifi, Users } from 'lucide-react-native';
import GlassCard from './GlassCard';

interface ConnectionStatusBannerProps {
  isConnected: boolean;
  deviceCount: number;
  networkName?: string;
}

export default function ConnectionStatusBanner({
  isConnected,
  deviceCount,
  networkName = 'Sherim Network',
}: ConnectionStatusBannerProps) {
  return (
    <GlassCard style={{ marginHorizontal: 16, marginTop: 16, padding: 16 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isConnected ? 'bg-emerald/20' : 'bg-slate-400/20'
            }`}
          >
            <Wifi
              size={20}
              color={isConnected ? '#10B981' : '#94A3B8'}
            />
          </View>
          <View>
            <Text className="text-off-white font-semibold text-base">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
            <Text className="text-slate-400 text-sm">{networkName}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Users size={16} color="#94A3B8" />
          <Text className="text-off-white font-mono text-sm">{deviceCount}</Text>
        </View>
      </View>
    </GlassCard>
  );
}
