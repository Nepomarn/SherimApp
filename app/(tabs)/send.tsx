import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import GlassCard from '@/components/GlassCard';
import FileGridItem from '@/components/FileGridItem';
import FilePreview from '@/components/FilePreview';
import DuplicateWarning from '@/components/DuplicateWarning';
import FileCategoryTabs, { FileCategory } from '@/components/FileCategoryTabs';
import TransferControls from '@/components/TransferControls';
import ProgressRing from '@/components/ProgressRing';
import FileManager, { FileManagerItem } from '@/components/FileManager';
import { QrCode, Plus, Eye, Image, FileText, Folder, FolderOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'document';
  uri?: string;
}

export default function SendScreen() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [pickedFiles, setPickedFiles] = useState<FileItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateFileNames, setDuplicateFileNames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [showFileManager, setShowFileManager] = useState(false);

  // Mock history for duplicate detection
  const mockHistory = ['vacation_photo.jpg', 'presentation.pdf'];

  const getFileType = (mimeType: string | undefined, name: string): FileItem['type'] => {
    if (mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return 'image';
    if (mimeType?.startsWith('video/') || /\.(mp4|mov|avi|mkv)$/i.test(name)) return 'video';
    if (mimeType?.startsWith('audio/') || /\.(mp3|wav|aac|flac)$/i.test(name)) return 'audio';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: FileItem[] = result.assets.map((asset, index) => ({
          id: `doc-${Date.now()}-${index}`,
          name: asset.name,
          size: formatFileSize(asset.size || 0),
          type: getFileType(asset.mimeType, asset.name),
          uri: asset.uri,
        }));
        setPickedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents');
    }
  };

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newFiles: FileItem[] = result.assets.map((asset, index) => ({
          id: `img-${Date.now()}-${index}`,
          name: asset.fileName || `media_${Date.now()}_${index}`,
          size: formatFileSize(asset.fileSize || 0),
          type: asset.type === 'video' ? 'video' : 'image',
          uri: asset.uri,
        }));
        setPickedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const toggleFileSelection = (file: FileItem) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.id === file.id)
        ? prev.filter((f) => f.id !== file.id)
        : [...prev, file]
    );
  };

  const removePickedFile = (fileId: string) => {
    setPickedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const checkForDuplicates = () => {
    const duplicates = selectedFiles
      .filter((file) => mockHistory.includes(file.name))
      .map((file) => file.name);
    
    if (duplicates.length > 0) {
      setDuplicateFileNames(duplicates);
      setShowDuplicateWarning(true);
      return true;
    }
    return false;
  };

  const handleGenerateQR = () => {
    if (selectedFiles.length > 0) {
      if (!checkForDuplicates()) {
        setShowQR(true);
      }
    }
  };

  const handleDuplicateContinue = () => {
    setShowDuplicateWarning(false);
    setShowQR(true);
  };

  const startTransfer = () => {
    setIsTransferring(true);
    setTransferProgress(0);
    
    const interval = setInterval(() => {
      setTransferProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTransferring(false);
            setShowQR(false);
            setSelectedFiles([]);
            setPickedFiles([]);
            Alert.alert('Success', 'Files transferred successfully!');
          }, 500);
          return 100;
        }
        return isPaused ? prev : prev + 2;
      });
    }, 100);
  };

  const getCategoryCounts = () => ({
    all: pickedFiles.length,
    images: pickedFiles.filter((f) => f.type === 'image').length,
    videos: pickedFiles.filter((f) => f.type === 'video').length,
    audio: pickedFiles.filter((f) => f.type === 'audio').length,
    documents: pickedFiles.filter((f) => f.type === 'document').length,
  });

  const handleFileManagerSelect = (files: FileManagerItem[]) => {
    const newFiles: FileItem[] = files.map((file, index) => ({
      id: `fm-${Date.now()}-${index}`,
      name: file.name,
      size: file.size || '0 KB',
      type: file.fileType || 'document',
      uri: file.uri || file.path,
    }));
    setPickedFiles((prev) => [...prev, ...newFiles]);
  };

  const filteredFiles = selectedCategory === 'all'
    ? pickedFiles
    : pickedFiles.filter((f) => {
        if (selectedCategory === 'images') return f.type === 'image';
        if (selectedCategory === 'videos') return f.type === 'video';
        if (selectedCategory === 'audio') return f.type === 'audio';
        if (selectedCategory === 'documents') return f.type === 'document';
        return true;
      });

  return (
    <View className="flex-1 bg-midnight">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-off-white text-3xl font-bold">Send Files</Text>
            <Text className="text-slate-400 text-base mt-2">
              Select files to share
            </Text>
          </View>

          {/* File Selection */}
          <View className="px-4 mt-4">
            {!showQR ? (
              <>
                {/* Add Files Buttons */}
                <View className="flex-row gap-3 mb-4">
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    onPress={() => setShowFileManager(true)}
                    style={{ flex: 1 }}
                  >
                    <GlassCard style={{ padding: 16 }}>
                      <View className="flex-row items-center justify-center gap-2">
                        <FolderOpen size={20} color="#F59E0B" />
                        <Text className="text-amber font-semibold text-sm">
                          Browse Files
                        </Text>
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    onPress={pickImages}
                    style={{ flex: 1 }}
                  >
                    <GlassCard style={{ padding: 16 }}>
                      <View className="flex-row items-center justify-center gap-2">
                        <Image size={20} color="#6366F1" />
                        <Text className="text-electric-indigo font-semibold text-sm">
                          Gallery
                        </Text>
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                </View>

                {/* Category Tabs */}
                {pickedFiles.length > 0 && (
                  <View className="mb-4">
                    <FileCategoryTabs
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      counts={getCategoryCounts()}
                    />
                  </View>
                )}

                {/* Selected Files Count */}
                {selectedFiles.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-off-white font-semibold text-lg">
                      Selected: {selectedFiles.length} file(s)
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Tap files to select/deselect
                    </Text>
                  </View>
                )}

                {/* File List */}
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <View key={file.id} className="flex-row items-center gap-2 mb-3">
                      <View className="flex-1">
                        <FileGridItem
                          fileName={file.name}
                          fileSize={file.size}
                          fileType={file.type}
                          isSelected={selectedFiles.some((f) => f.id === file.id)}
                          onPress={() => toggleFileSelection(file)}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setPreviewFile(file)}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Eye size={20} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : pickedFiles.length === 0 ? (
                  <GlassCard style={{ padding: 32, alignItems: 'center' }}>
                    <Folder size={48} color="#94A3B8" />
                    <Text className="text-off-white font-semibold text-lg mt-4">
                      No Files Selected
                    </Text>
                    <Text className="text-slate-400 text-center text-sm mt-2">
                      Tap "Photos" or "Files" above to add files
                    </Text>
                  </GlassCard>
                ) : (
                  <GlassCard style={{ padding: 24, alignItems: 'center' }}>
                    <Text className="text-slate-400 text-center text-sm">
                      No files in this category
                    </Text>
                  </GlassCard>
                )}

                {/* Generate QR Button */}
                {selectedFiles.length > 0 && (
                  <TouchableOpacity
                    onPress={handleGenerateQR}
                    activeOpacity={0.8}
                    style={{ marginTop: 16, marginBottom: 32 }}
                  >
                    <LinearGradient
                      colors={['#6366F1', '#8B5CF6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                      }}
                    >
                      <QrCode size={24} color="#F8FAFC" />
                      <Text className="text-off-white font-bold text-lg">
                        Generate QR Code
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </>
            ) : isTransferring ? (
              /* Transfer Progress */
              <View className="items-center py-8">
                <GlassCard style={{ padding: 32, alignItems: 'center', width: '100%' }}>
                  <ProgressRing progress={transferProgress} speed="45.2 MB/s" size={160} />
                  <Text className="text-off-white font-semibold text-xl mt-8">
                    {isPaused ? 'Transfer Paused' : 'Sending Files'}
                  </Text>
                  <Text className="text-slate-400 text-center text-sm mt-2">
                    {selectedFiles.length} file(s) • {transferProgress}% complete
                  </Text>
                  <TransferControls
                    isPaused={isPaused}
                    onPause={() => setIsPaused(true)}
                    onResume={() => setIsPaused(false)}
                    onCancel={() => {
                      setIsTransferring(false);
                      setShowQR(false);
                      setTransferProgress(0);
                    }}
                  />
                </GlassCard>
              </View>
            ) : (
              /* QR Code Display */
              <View className="items-center py-8">
                <GlassCard style={{ padding: 32, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 240,
                      height: 240,
                      backgroundColor: '#F8FAFC',
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 4,
                      borderColor: '#6366F1',
                    }}
                  >
                    <QrCode size={200} color="#0A0E27" />
                  </View>
                  <Text className="text-off-white font-semibold text-xl mt-6">
                    Scan to Receive
                  </Text>
                  <Text className="text-slate-400 text-center text-sm mt-2">
                    Waiting for receiver to scan...
                  </Text>
                  <View className="mt-6 px-4 py-3 bg-electric-indigo/20 rounded-lg">
                    <Text className="text-electric-indigo font-mono text-sm">
                      {selectedFiles.length} file(s) ready
                    </Text>
                  </View>
                  
                  {/* Simulate Transfer Button */}
                  <TouchableOpacity
                    onPress={startTransfer}
                    activeOpacity={0.8}
                    style={{ marginTop: 24, width: '100%' }}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text className="text-off-white font-bold text-base">
                        Start Transfer
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </GlassCard>

                <TouchableOpacity
                  onPress={() => setShowQR(false)}
                  style={{ marginTop: 24 }}
                >
                  <Text className="text-slate-400 text-base underline">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreview
            visible={!!previewFile}
            fileName={previewFile.name}
            fileSize={previewFile.size}
            fileType={previewFile.type}
            fileUri={previewFile.uri}
            onClose={() => setPreviewFile(null)}
            onConfirm={() => {
              toggleFileSelection(previewFile);
              setPreviewFile(null);
            }}
          />
        )}

        {/* Duplicate Warning Modal */}
        <DuplicateWarning
          visible={showDuplicateWarning}
          duplicateFiles={duplicateFileNames}
          onContinue={handleDuplicateContinue}
          onCancel={() => setShowDuplicateWarning(false)}
        />

        {/* File Manager Modal */}
        <FileManager
          visible={showFileManager}
          onClose={() => setShowFileManager(false)}
          onSelectFiles={handleFileManagerSelect}
          multiSelect={true}
        />
      </SafeAreaView>
    </View>
  );
}
