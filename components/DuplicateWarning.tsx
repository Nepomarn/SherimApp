import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { AlertTriangle, X, Check } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

interface DuplicateWarningProps {
  visible: boolean;
  duplicateFiles: string[];
  onContinue: () => void;
  onCancel: () => void;
}

export default function DuplicateWarning({
  visible,
  duplicateFiles,
  onContinue,
  onCancel,
}: DuplicateWarningProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(10, 14, 39, 0.95)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <GlassCard style={{ width: '100%', maxWidth: 400, padding: 24 }}>
          {/* Warning Icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={32} color="#F59E0B" />
          </View>

          {/* Title */}
          <Text className="text-off-white font-bold text-xl text-center">
            Duplicate Files Detected
          </Text>

          {/* Description */}
          <Text className="text-slate-400 text-center text-sm mt-3">
            The following files already exist in your history:
          </Text>

          {/* Duplicate Files List */}
          <View
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(245, 158, 11, 0.3)',
              maxHeight: 150,
            }}
          >
            {duplicateFiles.slice(0, 5).map((fileName, index) => (
              <View
                key={index}
                className="flex-row items-center gap-2 mb-2"
                style={{ marginBottom: index === duplicateFiles.length - 1 ? 0 : 8 }}
              >
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#F59E0B',
                  }}
                />
                <Text
                  className="text-amber text-sm flex-1"
                  numberOfLines={1}
                >
                  {fileName}
                </Text>
              </View>
            ))}
            {duplicateFiles.length > 5 && (
              <Text className="text-amber text-xs mt-2 text-center">
                +{duplicateFiles.length - 5} more
              </Text>
            )}
          </View>

          {/* Info Message */}
          <Text className="text-slate-400 text-center text-xs mt-4">
            Continuing will send these files again. This may create duplicate entries.
          </Text>

          {/* Action Buttons */}
          <View style={{ marginTop: 24, gap: 12 }}>
            <TouchableOpacity onPress={onContinue} activeOpacity={0.8}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Check size={20} color="#F8FAFC" />
                <Text className="text-off-white font-bold text-base">
                  Continue Anyway
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <X size={20} color="#94A3B8" />
              <Text className="text-slate-400 font-medium text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}
