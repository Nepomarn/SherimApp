import { View, Text } from 'react-native';
import { HardDrive } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

interface StorageIndicatorProps {
  usedSpace: number; // in GB
  totalSpace: number; // in GB
}

export default function StorageIndicator({
  usedSpace,
  totalSpace,
}: StorageIndicatorProps) {
  const usagePercentage = (usedSpace / totalSpace) * 100;
  const freeSpace = totalSpace - usedSpace;

  const getStorageColor = () => {
    if (usagePercentage >= 90) return '#F59E0B'; // Amber warning
    if (usagePercentage >= 75) return '#8B5CF6'; // Purple caution
    return '#10B981'; // Green healthy
  };

  return (
    <GlassCard style={{ padding: 16 }}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <HardDrive size={20} color="#94A3B8" />
          <Text className="text-off-white font-semibold text-base">
            Device Storage
          </Text>
        </View>
        <Text className="text-slate-400 font-mono text-sm">
          {freeSpace.toFixed(1)} GB free
        </Text>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={
            usagePercentage >= 90
              ? ['#F59E0B', '#F59E0B']
              : ['#6366F1', '#8B5CF6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${usagePercentage}%`,
            height: '100%',
          }}
        />
      </View>

      {/* Storage Stats */}
      <View className="flex-row items-center justify-between mt-3">
        <Text className="text-slate-400 font-mono text-xs">
          {usedSpace.toFixed(1)} GB used
        </Text>
        <Text
          className="font-mono text-xs font-semibold"
          style={{ color: getStorageColor() }}
        >
          {usagePercentage.toFixed(0)}%
        </Text>
        <Text className="text-slate-400 font-mono text-xs">
          {totalSpace.toFixed(1)} GB total
        </Text>
      </View>

      {/* Warning Message */}
      {usagePercentage >= 90 && (
        <View
          style={{
            marginTop: 12,
            padding: 8,
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(245, 158, 11, 0.3)',
          }}
        >
          <Text className="text-amber text-xs text-center">
            Storage almost full. Consider freeing up space.
          </Text>
        </View>
      )}
    </GlassCard>
  );
}
