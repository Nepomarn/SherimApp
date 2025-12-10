import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image, Video, Music, FileText, FolderOpen } from 'lucide-react-native';

export type FileCategory = 'all' | 'images' | 'videos' | 'audio' | 'documents';

interface FileCategoryTabsProps {
  selectedCategory: FileCategory;
  onSelectCategory: (category: FileCategory) => void;
  counts?: {
    all: number;
    images: number;
    videos: number;
    audio: number;
    documents: number;
  };
}

const categories: { key: FileCategory; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <FolderOpen size={18} color="#94A3B8" /> },
  { key: 'images', label: 'Images', icon: <Image size={18} color="#6366F1" /> },
  { key: 'videos', label: 'Videos', icon: <Video size={18} color="#8B5CF6" /> },
  { key: 'audio', label: 'Audio', icon: <Music size={18} color="#10B981" /> },
  { key: 'documents', label: 'Docs', icon: <FileText size={18} color="#F59E0B" /> },
];

export default function FileCategoryTabs({
  selectedCategory,
  onSelectCategory,
  counts,
}: FileCategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.key;
        const count = counts?.[category.key] ?? 0;

        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelectCategory(category.key)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: isSelected
                ? 'rgba(99, 102, 241, 0.2)'
                : 'rgba(26, 31, 58, 0.7)',
              borderWidth: 1,
              borderColor: isSelected ? '#6366F1' : 'rgba(148, 163, 184, 0.2)',
            }}
          >
            {category.icon}
            <Text
              className="font-medium text-sm"
              style={{ color: isSelected ? '#6366F1' : '#94A3B8' }}
            >
              {category.label}
            </Text>
            {counts && (
              <View
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(99, 102, 241, 0.3)'
                    : 'rgba(148, 163, 184, 0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  className="font-mono text-xs"
                  style={{ color: isSelected ? '#6366F1' : '#94A3B8' }}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
