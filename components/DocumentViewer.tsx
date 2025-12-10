import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import {
  X,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  Search,
  MoreVertical,
} from 'lucide-react-native';
import GlassCard from './GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

interface DocumentViewerProps {
  visible: boolean;
  fileName: string;
  fileSize: string;
  fileUri?: string;
  fileType?: string;
  totalPages?: number;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DocumentViewer({
  visible,
  fileName,
  fileSize,
  fileUri,
  fileType = 'pdf',
  totalPages = 12,
  onClose,
  onShare,
  onDownload,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel((prev) => prev + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel((prev) => prev - 25);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'pdf':
        return '#EF4444';
      case 'docx':
      case 'doc':
        return '#3B82F6';
      case 'xlsx':
      case 'xls':
        return '#10B981';
      case 'pptx':
      case 'ppt':
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
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
            backgroundColor: 'rgba(26, 31, 58, 0.98)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(148, 163, 184, 0.1)',
          }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
            <View className="flex-1 mx-4">
              <Text className="text-off-white font-semibold text-base text-center" numberOfLines={1}>
                {fileName}
              </Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                {fileSize} • {fileType.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowControls(!showControls)} activeOpacity={0.7}>
              <MoreVertical size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Document Content Area */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Document Preview Placeholder */}
          <View
            style={{
              width: screenWidth - 32,
              height: screenHeight * 0.6,
              backgroundColor: 'rgba(26, 31, 58, 0.7)',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ scale: zoomLevel / 100 }],
            }}
          >
            <View
              style={{
                width: 80,
                height: 100,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <FileText size={48} color={getFileTypeIcon()} />
            </View>
            <Text className="text-off-white font-semibold text-lg">Document Preview</Text>
            <Text className="text-slate-400 text-sm mt-2">
              Page {currentPage} of {totalPages}
            </Text>
            <View
              style={{
                marginTop: 24,
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 8,
              }}
            >
              <Text className="text-electric-indigo text-sm text-center">
                Full document rendering requires native PDF viewer integration
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Controls */}
        {showControls && (
          <View
            style={{
              backgroundColor: 'rgba(26, 31, 58, 0.98)',
              paddingHorizontal: 16,
              paddingVertical: 16,
              paddingBottom: 32,
              borderTopWidth: 1,
              borderTopColor: 'rgba(148, 163, 184, 0.1)',
            }}
          >
            {/* Page Navigation */}
            <View className="flex-row items-center justify-center gap-4 mb-4">
              <TouchableOpacity
                onPress={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: currentPage === 1 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(99, 102, 241, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={24} color={currentPage === 1 ? '#4B5563' : '#6366F1'} />
              </TouchableOpacity>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                  borderRadius: 8,
                }}
              >
                <Text className="text-off-white font-mono text-sm">
                  {currentPage} / {totalPages}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: currentPage === totalPages ? 'rgba(148, 163, 184, 0.1)' : 'rgba(99, 102, 241, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={24} color={currentPage === totalPages ? '#4B5563' : '#6366F1'} />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between">
              {/* Zoom Controls */}
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ZoomOut size={20} color={zoomLevel <= 50 ? '#4B5563' : '#94A3B8'} />
                </TouchableOpacity>
                <Text className="text-slate-400 font-mono text-sm w-12 text-center">{zoomLevel}%</Text>
                <TouchableOpacity
                  onPress={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ZoomIn size={20} color={zoomLevel >= 200 ? '#4B5563' : '#94A3B8'} />
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => setIsBookmarked(!isBookmarked)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bookmark size={20} color={isBookmarked ? '#F59E0B' : '#94A3B8'} fill={isBookmarked ? '#F59E0B' : 'transparent'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowSearch(!showSearch)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Search size={20} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onShare}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Share2 size={20} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDownload}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Download size={20} color="#6366F1" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
