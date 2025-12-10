import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  ChevronRight,
  ChevronLeft,
  Home,
  Search,
  Grid3X3,
  List,
  CheckCircle2,
  X,
  HardDrive,
  Download,
  Camera,
  ArrowUp,
  SortAsc,
  Filter,
  Clock,
  Star,
} from 'lucide-react-native';
import GlassCard from './GlassCard';
import StorageIndicator from './StorageIndicator';
import { LinearGradient } from 'expo-linear-gradient';

export interface FileManagerItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'image' | 'video' | 'audio' | 'document';
  size?: string;
  modifiedDate?: string;
  path: string;
  uri?: string;
  children?: FileManagerItem[];
}

interface FileManagerProps {
  visible: boolean;
  onClose: () => void;
  onSelectFiles: (files: FileManagerItem[]) => void;
  multiSelect?: boolean;
}

// Mock file system structure
const mockFileSystem: FileManagerItem[] = [
  {
    id: 'internal',
    name: 'Internal Storage',
    type: 'folder',
    path: '/storage/emulated/0',
    children: [
      {
        id: 'dcim',
        name: 'DCIM',
        type: 'folder',
        path: '/storage/emulated/0/DCIM',
        children: [
          {
            id: 'camera',
            name: 'Camera',
            type: 'folder',
            path: '/storage/emulated/0/DCIM/Camera',
            children: [
              { id: 'img1', name: 'IMG_20240115_143022.jpg', type: 'file', fileType: 'image', size: '3.2 MB', modifiedDate: 'Jan 15, 2024', path: '/storage/emulated/0/DCIM/Camera/IMG_20240115_143022.jpg' },
              { id: 'img2', name: 'IMG_20240114_092145.jpg', type: 'file', fileType: 'image', size: '2.8 MB', modifiedDate: 'Jan 14, 2024', path: '/storage/emulated/0/DCIM/Camera/IMG_20240114_092145.jpg' },
              { id: 'vid1', name: 'VID_20240113_185530.mp4', type: 'file', fileType: 'video', size: '45.6 MB', modifiedDate: 'Jan 13, 2024', path: '/storage/emulated/0/DCIM/Camera/VID_20240113_185530.mp4' },
              { id: 'img3', name: 'IMG_20240112_110830.jpg', type: 'file', fileType: 'image', size: '4.1 MB', modifiedDate: 'Jan 12, 2024', path: '/storage/emulated/0/DCIM/Camera/IMG_20240112_110830.jpg' },
              { id: 'img4', name: 'Screenshot_20240111.png', type: 'file', fileType: 'image', size: '1.2 MB', modifiedDate: 'Jan 11, 2024', path: '/storage/emulated/0/DCIM/Camera/Screenshot_20240111.png' },
            ],
          },
          {
            id: 'screenshots',
            name: 'Screenshots',
            type: 'folder',
            path: '/storage/emulated/0/DCIM/Screenshots',
            children: [
              { id: 'ss1', name: 'Screenshot_20240115_120000.png', type: 'file', fileType: 'image', size: '856 KB', modifiedDate: 'Jan 15, 2024', path: '/storage/emulated/0/DCIM/Screenshots/Screenshot_20240115_120000.png' },
              { id: 'ss2', name: 'Screenshot_20240114_093000.png', type: 'file', fileType: 'image', size: '1.1 MB', modifiedDate: 'Jan 14, 2024', path: '/storage/emulated/0/DCIM/Screenshots/Screenshot_20240114_093000.png' },
            ],
          },
        ],
      },
      {
        id: 'download',
        name: 'Download',
        type: 'folder',
        path: '/storage/emulated/0/Download',
        children: [
          { id: 'doc1', name: 'Project_Report.pdf', type: 'file', fileType: 'document', size: '2.4 MB', modifiedDate: 'Jan 10, 2024', path: '/storage/emulated/0/Download/Project_Report.pdf' },
          { id: 'doc2', name: 'Invoice_2024.pdf', type: 'file', fileType: 'document', size: '156 KB', modifiedDate: 'Jan 8, 2024', path: '/storage/emulated/0/Download/Invoice_2024.pdf' },
          { id: 'doc3', name: 'Presentation.pptx', type: 'file', fileType: 'document', size: '8.7 MB', modifiedDate: 'Jan 5, 2024', path: '/storage/emulated/0/Download/Presentation.pptx' },
          { id: 'img5', name: 'wallpaper.jpg', type: 'file', fileType: 'image', size: '5.2 MB', modifiedDate: 'Jan 3, 2024', path: '/storage/emulated/0/Download/wallpaper.jpg' },
        ],
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        path: '/storage/emulated/0/Documents',
        children: [
          { id: 'doc4', name: 'Resume.docx', type: 'file', fileType: 'document', size: '45 KB', modifiedDate: 'Dec 28, 2023', path: '/storage/emulated/0/Documents/Resume.docx' },
          { id: 'doc5', name: 'Notes.txt', type: 'file', fileType: 'document', size: '12 KB', modifiedDate: 'Dec 20, 2023', path: '/storage/emulated/0/Documents/Notes.txt' },
          {
            id: 'work',
            name: 'Work',
            type: 'folder',
            path: '/storage/emulated/0/Documents/Work',
            children: [
              { id: 'doc6', name: 'Meeting_Notes.docx', type: 'file', fileType: 'document', size: '28 KB', modifiedDate: 'Jan 14, 2024', path: '/storage/emulated/0/Documents/Work/Meeting_Notes.docx' },
              { id: 'doc7', name: 'Budget_2024.xlsx', type: 'file', fileType: 'document', size: '156 KB', modifiedDate: 'Jan 12, 2024', path: '/storage/emulated/0/Documents/Work/Budget_2024.xlsx' },
            ],
          },
        ],
      },
      {
        id: 'music',
        name: 'Music',
        type: 'folder',
        path: '/storage/emulated/0/Music',
        children: [
          { id: 'aud1', name: 'Favorite_Song.mp3', type: 'file', fileType: 'audio', size: '8.4 MB', modifiedDate: 'Dec 15, 2023', path: '/storage/emulated/0/Music/Favorite_Song.mp3' },
          { id: 'aud2', name: 'Podcast_Episode.mp3', type: 'file', fileType: 'audio', size: '45.2 MB', modifiedDate: 'Dec 10, 2023', path: '/storage/emulated/0/Music/Podcast_Episode.mp3' },
          { id: 'aud3', name: 'Voice_Recording.m4a', type: 'file', fileType: 'audio', size: '2.1 MB', modifiedDate: 'Jan 5, 2024', path: '/storage/emulated/0/Music/Voice_Recording.m4a' },
        ],
      },
      {
        id: 'movies',
        name: 'Movies',
        type: 'folder',
        path: '/storage/emulated/0/Movies',
        children: [
          { id: 'vid2', name: 'Family_Video.mp4', type: 'file', fileType: 'video', size: '256 MB', modifiedDate: 'Dec 25, 2023', path: '/storage/emulated/0/Movies/Family_Video.mp4' },
          { id: 'vid3', name: 'Tutorial.mp4', type: 'file', fileType: 'video', size: '128 MB', modifiedDate: 'Nov 20, 2023', path: '/storage/emulated/0/Movies/Tutorial.mp4' },
        ],
      },
      {
        id: 'pictures',
        name: 'Pictures',
        type: 'folder',
        path: '/storage/emulated/0/Pictures',
        children: [
          { id: 'img6', name: 'Profile_Photo.jpg', type: 'file', fileType: 'image', size: '1.8 MB', modifiedDate: 'Jan 1, 2024', path: '/storage/emulated/0/Pictures/Profile_Photo.jpg' },
          {
            id: 'vacation',
            name: 'Vacation 2023',
            type: 'folder',
            path: '/storage/emulated/0/Pictures/Vacation 2023',
            children: [
              { id: 'img7', name: 'Beach_Sunset.jpg', type: 'file', fileType: 'image', size: '4.5 MB', modifiedDate: 'Aug 15, 2023', path: '/storage/emulated/0/Pictures/Vacation 2023/Beach_Sunset.jpg' },
              { id: 'img8', name: 'Mountain_View.jpg', type: 'file', fileType: 'image', size: '5.2 MB', modifiedDate: 'Aug 16, 2023', path: '/storage/emulated/0/Pictures/Vacation 2023/Mountain_View.jpg' },
              { id: 'img9', name: 'Group_Photo.jpg', type: 'file', fileType: 'image', size: '3.8 MB', modifiedDate: 'Aug 17, 2023', path: '/storage/emulated/0/Pictures/Vacation 2023/Group_Photo.jpg' },
            ],
          },
        ],
      },
    ],
  },
];

// Quick access categories
const quickAccessCategories = [
  { id: 'images', name: 'Images', icon: ImageIcon, color: '#6366F1', filter: 'image' },
  { id: 'videos', name: 'Videos', icon: Video, color: '#8B5CF6', filter: 'video' },
  { id: 'audio', name: 'Audio', icon: Music, color: '#10B981', filter: 'audio' },
  { id: 'documents', name: 'Documents', icon: FileText, color: '#F59E0B', filter: 'document' },
];

// Recent files (mock)
const recentFiles: FileManagerItem[] = [
  { id: 'recent1', name: 'IMG_20240115_143022.jpg', type: 'file', fileType: 'image', size: '3.2 MB', modifiedDate: 'Jan 15, 2024', path: '/storage/emulated/0/DCIM/Camera/IMG_20240115_143022.jpg' },
  { id: 'recent2', name: 'Project_Report.pdf', type: 'file', fileType: 'document', size: '2.4 MB', modifiedDate: 'Jan 10, 2024', path: '/storage/emulated/0/Download/Project_Report.pdf' },
  { id: 'recent3', name: 'Voice_Recording.m4a', type: 'file', fileType: 'audio', size: '2.1 MB', modifiedDate: 'Jan 5, 2024', path: '/storage/emulated/0/Music/Voice_Recording.m4a' },
];

export default function FileManager({
  visible,
  onClose,
  onSelectFiles,
  multiSelect = true,
}: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(['Internal Storage']);
  const [currentItems, setCurrentItems] = useState<FileManagerItem[]>(mockFileSystem[0].children || []);
  const [selectedFiles, setSelectedFiles] = useState<FileManagerItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [showRecent, setShowRecent] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  const getAllFiles = (items: FileManagerItem[]): FileManagerItem[] => {
    let files: FileManagerItem[] = [];
    items.forEach((item) => {
      if (item.type === 'file') {
        files.push(item);
      }
      if (item.children) {
        files = [...files, ...getAllFiles(item.children)];
      }
    });
    return files;
  };

  const navigateToFolder = (folder: FileManagerItem) => {
    if (folder.type === 'folder' && folder.children) {
      setCurrentPath([...currentPath, folder.name]);
      setCurrentItems(folder.children);
      setActiveFilter(null);
    }
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);

      // Navigate back through the file system
      let items = mockFileSystem[0].children || [];
      for (let i = 1; i < newPath.length; i++) {
        const folder = items.find((item) => item.name === newPath[i]);
        if (folder?.children) {
          items = folder.children;
        }
      }
      setCurrentItems(items);
      setActiveFilter(null);
    }
  };

  const navigateToRoot = () => {
    setCurrentPath(['Internal Storage']);
    setCurrentItems(mockFileSystem[0].children || []);
    setActiveFilter(null);
  };

  const filterByCategory = (filter: string) => {
    setActiveFilter(filter);
    const allFiles = getAllFiles(mockFileSystem);
    const filtered = allFiles.filter((file) => file.fileType === filter);
    setCurrentItems(filtered);
    setCurrentPath(['Internal Storage', `All ${filter.charAt(0).toUpperCase() + filter.slice(1)}s`]);
  };

  const toggleFileSelection = (file: FileManagerItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file);
      return;
    }

    if (multiSelect) {
      setSelectedFiles((prev) =>
        prev.find((f) => f.id === file.id)
          ? prev.filter((f) => f.id !== file.id)
          : [...prev, file]
      );
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleConfirm = () => {
    onSelectFiles(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const getFileIcon = (item: FileManagerItem) => {
    if (item.type === 'folder') {
      return <Folder size={28} color="#F59E0B" />;
    }
    switch (item.fileType) {
      case 'image':
        return <ImageIcon size={28} color="#6366F1" />;
      case 'video':
        return <Video size={28} color="#8B5CF6" />;
      case 'audio':
        return <Music size={28} color="#10B981" />;
      default:
        return <FileText size={28} color="#94A3B8" />;
    }
  };

  const filteredItems = searchQuery
    ? currentItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentItems;

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return (b.modifiedDate || '').localeCompare(a.modifiedDate || '');
      case 'size':
        return 0; // Would need numeric size for proper sorting
      default:
        return 0;
    }
  });

  const renderItem = ({ item }: { item: FileManagerItem }) => {
    const isSelected = selectedFiles.some((f) => f.id === item.id);

    if (viewMode === 'grid') {
      return (
        <TouchableOpacity
          onPress={() => toggleFileSelection(item)}
          activeOpacity={0.7}
          style={{
            width: '31%',
            marginBottom: 12,
            marginHorizontal: '1%',
          }}
        >
          <View
            style={{
              backgroundColor: isSelected
                ? 'rgba(99, 102, 241, 0.3)'
                : 'rgba(26, 31, 58, 0.7)',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
              borderWidth: isSelected ? 2 : 1,
              borderColor: isSelected ? '#6366F1' : 'rgba(148, 163, 184, 0.2)',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              {getFileIcon(item)}
            </View>
            <Text
              className="text-off-white text-xs font-medium text-center"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {item.size && (
              <Text className="text-slate-400 text-xs font-mono mt-1">
                {item.size}
              </Text>
            )}
            {isSelected && (
              <View
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                }}
              >
                <CheckCircle2 size={18} color="#6366F1" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => toggleFileSelection(item)}
        activeOpacity={0.7}
        style={{ marginBottom: 8 }}
      >
        <View
          style={{
            backgroundColor: isSelected
              ? 'rgba(99, 102, 241, 0.2)'
              : 'rgba(26, 31, 58, 0.7)',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected ? '#6366F1' : 'transparent',
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {getFileIcon(item)}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="text-off-white text-sm font-medium" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              {item.size && (
                <Text className="text-slate-400 text-xs font-mono">{item.size}</Text>
              )}
              {item.modifiedDate && (
                <>
                  <Text className="text-slate-400 text-xs">•</Text>
                  <Text className="text-slate-400 text-xs">{item.modifiedDate}</Text>
                </>
              )}
              {item.type === 'folder' && item.children && (
                <Text className="text-slate-400 text-xs">
                  {item.children.length} items
                </Text>
              )}
            </View>
          </View>
          {item.type === 'folder' ? (
            <ChevronRight size={20} color="#94A3B8" />
          ) : isSelected ? (
            <CheckCircle2 size={22} color="#6366F1" />
          ) : (
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: 'rgba(148, 163, 184, 0.3)',
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0E27',
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: 16,
            paddingBottom: 12,
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(148, 163, 184, 0.1)',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
            <Text className="text-off-white text-lg font-bold">File Manager</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => setShowSearch(!showSearch)}
                activeOpacity={0.7}
              >
                <Search size={22} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                activeOpacity={0.7}
              >
                {viewMode === 'grid' ? (
                  <List size={22} color="#94A3B8" />
                ) : (
                  <Grid3X3 size={22} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          {showSearch && (
            <View
              style={{
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Search size={18} color="#94A3B8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search files..."
                placeholderTextColor="#94A3B8"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  color: '#F8FAFC',
                  fontSize: 14,
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Breadcrumb Navigation */}
          <View className="flex-row items-center">
            <TouchableOpacity onPress={navigateToRoot} activeOpacity={0.7}>
              <HardDrive size={18} color="#6366F1" />
            </TouchableOpacity>
            {currentPath.map((path, index) => (
              <View key={index} className="flex-row items-center">
                <ChevronRight size={16} color="#94A3B8" />
                <Text
                  className={`text-sm ${
                    index === currentPath.length - 1
                      ? 'text-off-white font-medium'
                      : 'text-slate-400'
                  }`}
                  numberOfLines={1}
                >
                  {path}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Access Categories */}
        {currentPath.length === 1 && !activeFilter && !showRecent && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            {/* Storage Indicator */}
            <View style={{ marginBottom: 16 }}>
              <StorageIndicator usedSpace={45.2} totalSpace={64} />
            </View>

            <Text className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">
              Quick Access
            </Text>
            <View className="flex-row gap-2">
              {quickAccessCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => filterByCategory(category.filter)}
                  activeOpacity={0.7}
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(26, 31, 58, 0.7)',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    <category.icon size={24} color={category.color} />
                    <Text className="text-off-white text-xs font-medium mt-2">
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Files */}
            <View style={{ marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setShowRecent(!showRecent)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between mb-3"
              >
                <View className="flex-row items-center gap-2">
                  <Clock size={14} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Recent Files
                  </Text>
                </View>
                <Text className="text-electric-indigo text-xs">View All</Text>
              </TouchableOpacity>
              {recentFiles.slice(0, 3).map((file) => (
                <TouchableOpacity
                  key={file.id}
                  onPress={() => toggleFileSelection(file)}
                  activeOpacity={0.7}
                  style={{ marginBottom: 8 }}
                >
                  <View
                    style={{
                      backgroundColor: selectedFiles.some((f) => f.id === file.id)
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(26, 31, 58, 0.5)',
                      borderRadius: 10,
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: selectedFiles.some((f) => f.id === file.id) ? 1 : 0,
                      borderColor: '#6366F1',
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      {getFileIcon(file)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text className="text-off-white text-sm font-medium" numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text className="text-slate-400 text-xs">{file.size}</Text>
                    </View>
                    {selectedFiles.some((f) => f.id === file.id) ? (
                      <CheckCircle2 size={18} color="#6366F1" />
                    ) : (
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          borderWidth: 2,
                          borderColor: 'rgba(148, 163, 184, 0.3)',
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Back Button */}
        {currentPath.length > 1 && (
          <TouchableOpacity
            onPress={navigateBack}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: 'rgba(26, 31, 58, 0.5)',
            }}
          >
            <ArrowUp size={18} color="#6366F1" />
            <Text className="text-electric-indigo text-sm font-medium ml-2">
              Go up
            </Text>
          </TouchableOpacity>
        )}

        {/* Sort Options */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text className="text-slate-400 text-xs">
            {sortedItems.length} items
          </Text>
          <View className="flex-row items-center gap-2">
            <SortAsc size={14} color="#94A3B8" />
            <TouchableOpacity
              onPress={() =>
                setSortBy(sortBy === 'name' ? 'date' : sortBy === 'date' ? 'size' : 'name')
              }
            >
              <Text className="text-slate-400 text-xs">
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* File List */}
        <FlatList
          data={sortedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
          numColumns={viewMode === 'grid' ? 3 : 1}
          key={viewMode}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Folder size={48} color="#94A3B8" />
              <Text className="text-off-white font-semibold text-lg mt-4">
                No Files Found
              </Text>
              <Text className="text-slate-400 text-center text-sm mt-2">
                This folder is empty
              </Text>
            </View>
          }
        />

        {/* Bottom Action Bar */}
        {selectedFiles.length > 0 && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(26, 31, 58, 0.98)',
              paddingHorizontal: 16,
              paddingVertical: 16,
              paddingBottom: 32,
              borderTopWidth: 1,
              borderTopColor: 'rgba(148, 163, 184, 0.1)',
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-off-white font-semibold">
                {selectedFiles.length} file(s) selected
              </Text>
              <TouchableOpacity onPress={() => setSelectedFiles([])}>
                <Text className="text-slate-400 text-sm">Clear</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8}>
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
                <CheckCircle2 size={20} color="#F8FAFC" />
                <Text className="text-off-white font-bold text-base">
                  Select Files
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
