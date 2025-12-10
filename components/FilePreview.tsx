import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { X, File, Image as ImageIcon, Video, Music } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

interface FilePreviewProps {
  visible: boolean;
  fileName: string;
  fileSize: string;
  fileType: 'image' | 'video' | 'audio' | 'document';
  fileUri?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function FilePreview({
  visible,
  fileName,
  fileSize,
  fileType,
  fileUri,
  onClose,
  onConfirm,
}: FilePreviewProps) {
  const getIcon = () => {
    switch (fileType) {
      case 'image':
        return <ImageIcon size={64} color="#6366F1" />;
      case 'video':
        return <Video size={64} color="#8B5CF6" />;
      case 'audio':
        return <Music size={64} color="#10B981" />;
      default:
        return <File size={64} color="#94A3B8" />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(148, 163, 184, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Preview Content */}
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            {fileType === 'image' && fileUri ? (
              <Image
                source={{ uri: fileUri }}
                style={{
                  width: '100%',
                  height: 240,
                  borderRadius: 12,
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 240,
                  borderRadius: 12,
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getIcon()}
              </View>
            )}

            {/* File Info */}
            <View style={{ width: '100%', marginTop: 20 }}>
              <Text
                className="text-off-white font-semibold text-lg text-center"
                numberOfLines={2}
              >
                {fileName}
              </Text>
              <Text className="text-slate-400 font-mono text-sm text-center mt-2">
                {fileSize}
              </Text>
              <View
                style={{
                  marginTop: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 8,
                  alignSelf: 'center',
                }}
              >
                <Text className="text-electric-indigo font-medium text-sm capitalize">
                  {fileType}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {onConfirm && (
              <View style={{ width: '100%', marginTop: 24, gap: 12 }}>
                <TouchableOpacity onPress={onConfirm} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text className="text-off-white font-bold text-base">
                      Confirm Selection
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-slate-400 font-medium text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}
