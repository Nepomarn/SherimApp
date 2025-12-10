import { View, Text, TouchableOpacity } from 'react-native';
import { Pause, Play, X, RefreshCw } from 'lucide-react-native';

interface TransferControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function TransferControls({
  isPaused,
  onPause,
  onResume,
  onCancel,
  onRetry,
  showRetry = false,
}: TransferControlsProps) {
  return (
    <View className="flex-row items-center justify-center gap-4 mt-6">
      {showRetry && onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.7}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(16, 185, 129, 0.5)',
          }}
        >
          <RefreshCw size={24} color="#10B981" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={isPaused ? onResume : onPause}
          activeOpacity={0.7}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isPaused
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(245, 158, 11, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: isPaused
              ? 'rgba(16, 185, 129, 0.5)'
              : 'rgba(245, 158, 11, 0.5)',
          }}
        >
          {isPaused ? (
            <Play size={24} color="#10B981" />
          ) : (
            <Pause size={24} color="#F59E0B" />
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onCancel}
        activeOpacity={0.7}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.5)',
        }}
      >
        <X size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}
