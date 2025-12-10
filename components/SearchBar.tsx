import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import GlassCard from './GlassCard';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search files...',
}: SearchBarProps) {
  return (
    <GlassCard style={{ padding: 12 }}>
      <View className="flex-row items-center gap-3">
        <Search size={20} color="#94A3B8" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 text-off-white text-base"
          style={{ fontFamily: 'System' }}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: 'rgba(148, 163, 184, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </GlassCard>
  );
}
