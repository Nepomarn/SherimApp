import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Smartphone, Tablet, Laptop, Check, Wifi } from 'lucide-react-native';
import GlassCard from './GlassCard';

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop';
  isConnected: boolean;
  isTrusted?: boolean;
  lastSeen?: string;
}

interface DeviceListProps {
  devices: Device[];
  onDevicePress?: (device: Device) => void;
  onTrustDevice?: (device: Device) => void;
}

export default function DeviceList({
  devices,
  onDevicePress,
  onTrustDevice,
}: DeviceListProps) {
  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone size={24} color="#6366F1" />;
      case 'tablet':
        return <Tablet size={24} color="#8B5CF6" />;
      case 'laptop':
        return <Laptop size={24} color="#10B981" />;
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      onPress={() => onDevicePress?.(item)}
      activeOpacity={0.7}
      style={{ marginBottom: 12 }}
    >
      <GlassCard
        style={{
          padding: 16,
          borderWidth: item.isConnected ? 1 : 0,
          borderColor: item.isConnected ? '#10B981' : 'transparent',
        }}
      >
        <View className="flex-row items-center gap-4">
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getDeviceIcon(item.type)}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-off-white font-semibold text-base">
                {item.name}
              </Text>
              {item.isTrusted && (
                <View
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                  }}
                >
                  <Text className="text-emerald text-xs font-medium">Trusted</Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center gap-2 mt-1">
              {item.isConnected ? (
                <>
                  <Wifi size={14} color="#10B981" />
                  <Text className="text-emerald text-sm">Connected</Text>
                </>
              ) : (
                <Text className="text-slate-400 text-sm">
                  Last seen: {item.lastSeen || 'Unknown'}
                </Text>
              )}
            </View>
          </View>
          {!item.isTrusted && onTrustDevice && (
            <TouchableOpacity
              onPress={() => onTrustDevice(item)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={18} color="#6366F1" />
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  if (devices.length === 0) {
    return (
      <GlassCard style={{ padding: 32, alignItems: 'center' }}>
        <Wifi size={48} color="#94A3B8" />
        <Text className="text-off-white font-semibold text-lg mt-4">
          No Devices Found
        </Text>
        <Text className="text-slate-400 text-center text-sm mt-2">
          Make sure both devices are on the same network
        </Text>
      </GlassCard>
    );
  }

  return (
    <FlatList
      data={devices}
      renderItem={renderDevice}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}
