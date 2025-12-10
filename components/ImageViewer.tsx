import { View, Text, TouchableOpacity, Modal, Image, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Heart,
  Info,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ImageViewerProps {
  visible: boolean;
  images: Array<{
    uri: string;
    name: string;
    size: string;
    date?: string;
  }>;
  initialIndex?: number;
  onClose: () => void;
  onShare?: (index: number) => void;
  onDownload?: (index: number) => void;
  onDelete?: (index: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImageViewer({
  visible,
  images,
  initialIndex = 0,
  onClose,
  onShare,
  onDownload,
  onDelete,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentImage = images[currentIndex];

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.5);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.5);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(10, 14, 39, 0.98)',
        }}
      >
        {/* Header */}
        {showControls && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 50,
              paddingHorizontal: 16,
              paddingBottom: 12,
              backgroundColor: 'rgba(10, 14, 39, 0.8)',
              zIndex: 10,
            }}
          >
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={24} color="#F8FAFC" />
              </TouchableOpacity>
              <View className="flex-1 mx-4">
                <Text className="text-off-white font-semibold text-base text-center" numberOfLines={1}>
                  {currentImage?.name}
                </Text>
                <Text className="text-slate-400 text-xs text-center mt-1">
                  {currentIndex + 1} of {images.length}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowInfo(!showInfo)} activeOpacity={0.7}>
                <Info size={24} color={showInfo ? '#6366F1' : '#F8FAFC'} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Image Container */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            {currentImage?.uri ? (
              <Image
                source={{ uri: currentImage.uri }}
                style={{
                  width: screenWidth * zoomLevel,
                  height: screenHeight * 0.7 * zoomLevel,
                  transform: [{ rotate: `${rotation}deg` }],
                }}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{
                  width: screenWidth - 48,
                  height: screenHeight * 0.5,
                  backgroundColor: 'rgba(26, 31, 58, 0.7)',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="text-slate-400 text-base">No image available</Text>
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>

        {/* Navigation Arrows */}
        {images.length > 1 && showControls && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={handlePrev}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  marginTop: -24,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(26, 31, 58, 0.8)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={28} color="#F8FAFC" />
              </TouchableOpacity>
            )}
            {currentIndex < images.length - 1 && (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  marginTop: -24,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(26, 31, 58, 0.8)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={28} color="#F8FAFC" />
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Info Panel */}
        {showInfo && showControls && (
          <View
            style={{
              position: 'absolute',
              top: 110,
              right: 16,
              backgroundColor: 'rgba(26, 31, 58, 0.95)',
              borderRadius: 12,
              padding: 16,
              width: 200,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.2)',
            }}
          >
            <Text className="text-off-white font-semibold text-sm mb-2">File Info</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">Name:</Text>
                <Text className="text-off-white text-xs" numberOfLines={1} style={{ maxWidth: 100 }}>
                  {currentImage?.name}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">Size:</Text>
                <Text className="text-off-white text-xs">{currentImage?.size}</Text>
              </View>
              {currentImage?.date && (
                <View className="flex-row justify-between">
                  <Text className="text-slate-400 text-xs">Date:</Text>
                  <Text className="text-off-white text-xs">{currentImage.date}</Text>
                </View>
              )}
              <View className="flex-row justify-between">
                <Text className="text-slate-400 text-xs">Zoom:</Text>
                <Text className="text-off-white text-xs">{Math.round(zoomLevel * 100)}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(10, 14, 39, 0.8)',
              paddingHorizontal: 16,
              paddingVertical: 16,
              paddingBottom: 32,
            }}
          >
            {/* Zoom & Rotate Controls */}
            <View className="flex-row items-center justify-center gap-4 mb-4">
              <TouchableOpacity
                onPress={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ZoomOut size={22} color={zoomLevel <= 0.5 ? '#4B5563' : '#F8FAFC'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetView}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  borderRadius: 8,
                }}
              >
                <Text className="text-off-white font-mono text-sm">{Math.round(zoomLevel * 100)}%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleZoomIn}
                disabled={zoomLevel >= 3}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ZoomIn size={22} color={zoomLevel >= 3 ? '#4B5563' : '#F8FAFC'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRotate}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RotateCw size={22} color="#F8FAFC" />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setIsLiked(!isLiked)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart
                  size={24}
                  color={isLiked ? '#EF4444' : '#F8FAFC'}
                  fill={isLiked ? '#EF4444' : 'transparent'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onShare?.(currentIndex)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Share2 size={24} color="#F8FAFC" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDownload?.(currentIndex)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Download size={24} color="#F8FAFC" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Edit3 size={24} color="#F8FAFC" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete?.(currentIndex)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentIndex(index);
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: index === currentIndex ? '#6366F1' : 'transparent',
                    }}
                  >
                    <Image
                      source={{ uri: img.uri }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}
