import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SearchBar from '@/components/SearchBar';
import { CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, MoreVertical, Clock, Filter } from 'lucide-react-native';

interface HistoryItem {
  id: string;
  type: 'sent' | 'received';
  fileName: string;
  fileCount: number;
  size: string;
  timestamp: string;
  status: 'success' | 'failed';
  deviceName: string;
}

export default function HistoryScreen() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

  // Mock history data
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'sent',
      fileName: 'vacation_photos.zip',
      fileCount: 15,
      size: '45.2 MB',
      timestamp: '2 hours ago',
      status: 'success',
      deviceName: "John's Phone",
    },
    {
      id: '2',
      type: 'received',
      fileName: 'presentation.pdf',
      fileCount: 1,
      size: '5.1 MB',
      timestamp: '5 hours ago',
      status: 'success',
      deviceName: "Sarah's Tablet",
    },
    {
      id: '3',
      type: 'sent',
      fileName: 'documents.zip',
      fileCount: 8,
      size: '12.8 MB',
      timestamp: 'Yesterday',
      status: 'failed',
      deviceName: "Mike's Laptop",
    },
    {
      id: '4',
      type: 'received',
      fileName: 'music_album.zip',
      fileCount: 12,
      size: '89.5 MB',
      timestamp: '2 days ago',
      status: 'success',
      deviceName: "Alex's Phone",
    },
  ];

  // Filter and search logic
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.deviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <View className="flex-1 bg-midnight">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-off-white text-3xl font-bold">History</Text>
            <Text className="text-slate-400 text-base mt-2">
              Recent transfers
            </Text>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search files or devices..."
            />
          </View>

          {/* Filter Buttons */}
          <View className="px-4 mb-4">
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setFilterType('all')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: filterType === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                  borderWidth: 1,
                  borderColor: filterType === 'all' ? '#6366F1' : 'transparent',
                }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ color: filterType === 'all' ? '#6366F1' : '#94A3B8' }}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterType('sent')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: filterType === 'sent' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                  borderWidth: 1,
                  borderColor: filterType === 'sent' ? '#6366F1' : 'transparent',
                }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ color: filterType === 'sent' ? '#6366F1' : '#94A3B8' }}
                >
                  Sent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterType('received')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: filterType === 'received' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                  borderWidth: 1,
                  borderColor: filterType === 'received' ? '#6366F1' : 'transparent',
                }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ color: filterType === 'received' ? '#6366F1' : '#94A3B8' }}
                >
                  Received
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* History Timeline */}
          <View className="px-4 mt-4">
            {filteredItems.map((item, index) => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onLongPress={() => setSelectedItem(item.id)}
                >
                  <GlassCard style={{ padding: 16 }}>
                    <View className="flex-row items-start justify-between">
                      {/* Left Side - Icon and Info */}
                      <View className="flex-row gap-3 flex-1">
                        {/* Transfer Type Icon */}
                        <View
                          className={`w-12 h-12 rounded-xl items-center justify-center ${
                            item.type === 'sent'
                              ? 'bg-electric-indigo/20'
                              : 'bg-vivid-purple/20'
                          }`}
                        >
                          {item.type === 'sent' ? (
                            <ArrowUpRight size={24} color="#6366F1" />
                          ) : (
                            <ArrowDownLeft size={24} color="#8B5CF6" />
                          )}
                        </View>

                        {/* File Info */}
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text
                              className="text-off-white font-semibold text-base"
                              numberOfLines={1}
                            >
                              {item.fileName}
                            </Text>
                            {item.status === 'success' ? (
                              <CheckCircle2 size={16} color="#10B981" />
                            ) : (
                              <XCircle size={16} color="#F59E0B" />
                            )}
                          </View>
                          <Text className="text-slate-400 text-sm mt-1">
                            {item.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
                            {item.deviceName}
                          </Text>
                          <View className="flex-row items-center gap-3 mt-2">
                            <Text className="text-slate-400 font-mono text-xs">
                              {item.fileCount} file{item.fileCount > 1 ? 's' : ''}
                            </Text>
                            <Text className="text-slate-400 text-xs">•</Text>
                            <Text className="text-slate-400 font-mono text-xs">
                              {item.size}
                            </Text>
                            <Text className="text-slate-400 text-xs">•</Text>
                            <Text className="text-slate-400 text-xs">
                              {item.timestamp}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Right Side - More Options */}
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedItem(selectedItem === item.id ? null : item.id)
                        }
                      >
                        <MoreVertical size={20} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>

                    {/* Context Menu */}
                    {selectedItem === item.id && (
                      <View className="mt-4 pt-4 border-t border-glass">
                        <View className="flex-row flex-wrap gap-2">
                          <TouchableOpacity
                            className="px-4 py-2 bg-electric-indigo/20 rounded-lg"
                            onPress={() => setSelectedItem(null)}
                          >
                            <Text className="text-electric-indigo font-medium text-sm">
                              Re-send
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="px-4 py-2 bg-slate-400/20 rounded-lg"
                            onPress={() => setSelectedItem(null)}
                          >
                            <Text className="text-slate-400 font-medium text-sm">
                              Share
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="px-4 py-2 bg-amber/20 rounded-lg"
                            onPress={() => setSelectedItem(null)}
                          >
                            <Text className="text-amber font-medium text-sm">
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </GlassCard>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Empty State (if no results) */}
          {filteredItems.length === 0 && historyItems.length > 0 && (
            <View className="px-4 mt-20 items-center">
              <GlassCard style={{ padding: 48, alignItems: 'center', width: '100%' }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Filter size={40} color="#94A3B8" />
                </View>
                <Text className="text-off-white font-semibold text-xl">
                  No Results Found
                </Text>
                <Text className="text-slate-400 text-center text-sm mt-2">
                  Try adjusting your search or filter
                </Text>
              </GlassCard>
            </View>
          )}

          {/* Empty State (if no history) */}
          {historyItems.length === 0 && (
            <View className="px-4 mt-20 items-center">
              <GlassCard style={{ padding: 48, alignItems: 'center', width: '100%' }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Clock size={40} color="#94A3B8" />
                </View>
                <Text className="text-off-white font-semibold text-xl">
                  No History Yet
                </Text>
                <Text className="text-slate-400 text-center text-sm mt-2">
                  Your transfer history will appear here
                </Text>
              </GlassCard>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
