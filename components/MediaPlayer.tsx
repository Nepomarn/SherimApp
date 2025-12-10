import { View, Text, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Share2,
  MoreVertical,
  Music,
  Video,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MediaPlayerProps {
  visible: boolean;
  fileName: string;
  fileSize: string;
  fileUri?: string;
  mediaType: 'audio' | 'video';
  duration?: number; // in seconds
  artist?: string;
  album?: string;
  thumbnail?: string;
  onClose: () => void;
  onShare?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MediaPlayer({
  visible,
  fileName,
  fileSize,
  fileUri,
  mediaType,
  duration = 245,
  artist = 'Unknown Artist',
  album = 'Unknown Album',
  thumbnail,
  onClose,
  onShare,
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Simulate playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (isRepeat) {
              return 0;
            }
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isRepeat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const handleSkipBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime((prev) => Math.min(duration, prev + 10));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <ChevronDown size={28} color="#94A3B8" />
          </TouchableOpacity>
          <View className="flex-1 mx-4">
            <Text className="text-slate-400 text-xs text-center uppercase tracking-wider">
              Now Playing
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <MoreVertical size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Media Content */}
        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
          {/* Thumbnail / Video Area */}
          <View
            style={{
              width: '100%',
              aspectRatio: mediaType === 'video' ? 16 / 9 : 1,
              maxHeight: mediaType === 'video' ? screenHeight * 0.4 : screenWidth - 48,
              backgroundColor: 'rgba(26, 31, 58, 0.7)',
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              overflow: 'hidden',
              alignSelf: 'center',
            }}
          >
            {thumbnail ? (
              <Image
                source={{ uri: thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={mediaType === 'video' ? ['#8B5CF6', '#6366F1'] : ['#6366F1', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mediaType === 'video' ? (
                  <Video size={80} color="#F8FAFC" />
                ) : (
                  <Music size={80} color="#F8FAFC" />
                )}
              </LinearGradient>
            )}

            {/* Play Overlay for Video */}
            {mediaType === 'video' && !isPlaying && (
              <TouchableOpacity
                onPress={() => setIsPlaying(true)}
                style={{
                  position: 'absolute',
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={40} color="#F8FAFC" fill="#F8FAFC" />
              </TouchableOpacity>
            )}
          </View>

          {/* Track Info */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text className="text-off-white font-bold text-2xl text-center" numberOfLines={1}>
              {fileName.replace(/\.[^/.]+$/, '')}
            </Text>
            {mediaType === 'audio' && (
              <>
                <Text className="text-slate-400 text-base mt-2">{artist}</Text>
                <Text className="text-slate-400 text-sm mt-1">{album}</Text>
              </>
            )}
            <Text className="text-slate-400 font-mono text-xs mt-2">{fileSize}</Text>
          </View>

          {/* Progress Bar */}
          <View style={{ marginBottom: 24 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                const percentage = locationX / (screenWidth - 48);
                handleSeek(Math.max(0, Math.min(duration, duration * percentage)));
              }}
              style={{
                height: 6,
                backgroundColor: 'rgba(148, 163, 184, 0.3)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: `${(currentTime / duration) * 100}%`,
                  borderRadius: 3,
                }}
              />
            </TouchableOpacity>
            <View className="flex-row justify-between px-2 mt-2">
              <Text className="text-slate-400 font-mono text-xs">{formatTime(currentTime)}</Text>
              <Text className="text-slate-400 font-mono text-xs">{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center justify-center gap-6 mb-8">
            <TouchableOpacity
              onPress={() => setIsShuffle(!isShuffle)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shuffle size={22} color={isShuffle ? '#6366F1' : '#94A3B8'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkipBack}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SkipBack size={24} color="#F8FAFC" fill="#F8FAFC" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isPlaying ? (
                  <Pause size={32} color="#F8FAFC" fill="#F8FAFC" />
                ) : (
                  <Play size={32} color="#F8FAFC" fill="#F8FAFC" style={{ marginLeft: 4 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkipForward}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SkipForward size={24} color="#F8FAFC" fill="#F8FAFC" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsRepeat(!isRepeat)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Repeat size={22} color={isRepeat ? '#6366F1' : '#94A3B8'} />
            </TouchableOpacity>
          </View>

          {/* Secondary Controls */}
          <View className="flex-row items-center justify-between px-4">
            <TouchableOpacity
              onPress={() => setIsLiked(!isLiked)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart
                size={24}
                color={isLiked ? '#EF4444' : '#94A3B8'}
                fill={isLiked ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>

            {/* Volume Control */}
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX size={24} color="#94A3B8" />
                ) : (
                  <Volume2 size={24} color="#94A3B8" />
                )}
              </TouchableOpacity>
              <View style={{ width: 100, height: 4, backgroundColor: 'rgba(148, 163, 184, 0.3)', borderRadius: 2 }}>
                <View
                  style={{
                    width: `${isMuted ? 0 : volume * 100}%`,
                    height: '100%',
                    backgroundColor: '#6366F1',
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={onShare}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Share2 size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
