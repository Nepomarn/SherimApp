import { View, Text, TouchableOpacity } from 'react-native';
import { File, Image as ImageIcon, Video, Music, CheckCircle2 } from 'lucide-react-native';
import GlassCard from './GlassCard';

interface FileGridItemProps {
  fileName: string;
  fileSize: string;
  fileType: 'image' | 'video' | 'audio' | 'document';
  isSelected?: boolean;
  onPress?: () => void;
}

export default function FileGridItem({
  fileName,
  fileSize,
  fileType,
  isSelected = false,
  onPress,
}: FileGridItemProps) {
  const getIcon = () => {
    switch (fileType) {
      case 'image':
        return <ImageIcon size={32} color="#6366F1" />;
      case 'video':
        return <Video size={32} color="#8B5CF6" />;
      case 'audio':
        return <Music size={32} color="#10B981" />;
      default:
        return <File size={32} color="#94A3B8" />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard
        style={{
          padding: 16,
          marginBottom: 12,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? '#6366F1' : 'transparent',
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-12 h-12 rounded-xl bg-glass items-center justify-center">
              {getIcon()}
            </View>
            <View className="flex-1">
              <Text className="text-off-white font-medium text-sm" numberOfLines={1}>
                {fileName}
              </Text>
              <Text className="text-slate-400 font-mono text-xs mt-1">{fileSize}</Text>
            </View>
          </View>
          {isSelected && (
            <CheckCircle2 size={24} color="#6366F1" />
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}
