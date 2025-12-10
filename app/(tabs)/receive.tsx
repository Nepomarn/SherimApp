import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import ProgressRing from '@/components/ProgressRing';
import DeviceList, { Device } from '@/components/DeviceList';
import TransferControls from '@/components/TransferControls';
import { Camera, Download, Wifi, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReceiveScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // Mock nearby devices
  const [nearbyDevices] = useState<Device[]>([
    { id: '1', name: 'John\'s iPhone', type: 'phone', isConnected: false, lastSeen: '2 min ago' },
    { id: '2', name: 'Sarah\'s iPad', type: 'tablet', isConnected: false, isTrusted: true, lastSeen: '5 min ago' },
    { id: '3', name: 'Work Laptop', type: 'laptop', isConnected: false, lastSeen: '10 min ago' },
  ]);

  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate scanning and receiving
    setTimeout(() => {
      setIsScanning(false);
      setIsReceiving(true);
      setConnectedDevice({ id: '1', name: 'John\'s iPhone', type: 'phone', isConnected: true });
      // Simulate progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (!isPaused) {
          currentProgress += 5;
          setProgress(currentProgress);
        }
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsReceiving(false);
            setProgress(0);
            setConnectedDevice(null);
          }, 1000);
        }
      }, 200);
    }, 2000);
  };

  const handleDeviceConnect = (device: Device) => {
    setConnectedDevice({ ...device, isConnected: true });
    setShowDevices(false);
    setIsReceiving(true);
    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (!isPaused) {
        currentProgress += 5;
        setProgress(currentProgress);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsReceiving(false);
          setProgress(0);
          setConnectedDevice(null);
        }, 1000);
      }
    }, 200);
  };

  const handleCancelTransfer = () => {
    setIsReceiving(false);
    setProgress(0);
    setIsPaused(false);
    setConnectedDevice(null);
  };

  return (
    <View className="flex-1 bg-midnight">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-off-white text-3xl font-bold">
              Receive Files
            </Text>
            <Text className="text-slate-400 text-base mt-2">
              Scan QR code to receive
            </Text>
          </View>

          {/* Main Content */}
          <View className="px-4 mt-8 items-center">
            {!isScanning && !isReceiving && !showDevices ? (
              /* Scan Button */
              <View className="items-center w-full">
                <GlassCard style={{ padding: 48, alignItems: 'center', width: '100%' }}>
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <Camera size={56} color="#6366F1" />
                  </View>
                  <Text className="text-off-white font-semibold text-xl text-center">
                    Ready to Receive
                  </Text>
                  <Text className="text-slate-400 text-center text-sm mt-2 mb-8">
                    Scan QR code or connect to nearby device
                  </Text>
                  <TouchableOpacity
                    onPress={handleScanQR}
                    activeOpacity={0.8}
                    style={{ width: '100%' }}
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
                      <Camera size={24} color="#F8FAFC" />
                      <Text className="text-off-white font-bold text-lg">
                        Scan QR Code
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {/* Nearby Devices Button */}
                  <TouchableOpacity
                    onPress={() => setShowDevices(true)}
                    activeOpacity={0.8}
                    style={{ width: '100%', marginTop: 12 }}
                  >
                    <View
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                        borderWidth: 1,
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      }}
                    >
                      <Users size={24} color="#94A3B8" />
                      <Text className="text-slate-400 font-bold text-lg">
                        Nearby Devices
                      </Text>
                    </View>
                  </TouchableOpacity>
                </GlassCard>

                {/* Instructions */}
                <View className="mt-8 w-full">
                  <Text className="text-off-white font-semibold text-lg mb-4">
                    How it works
                  </Text>
                  <GlassCard style={{ padding: 20 }}>
                    <View className="gap-4">
                      <View className="flex-row gap-3">
                        <View className="w-8 h-8 rounded-full bg-electric-indigo items-center justify-center">
                          <Text className="text-off-white font-bold text-sm">1</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-off-white font-medium">
                            Tap Scan QR Code
                          </Text>
                          <Text className="text-slate-400 text-sm mt-1">
                            Camera will open with overlay guide
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-3">
                        <View className="w-8 h-8 rounded-full bg-vivid-purple items-center justify-center">
                          <Text className="text-off-white font-bold text-sm">2</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-off-white font-medium">
                            Scan sender's code
                          </Text>
                          <Text className="text-slate-400 text-sm mt-1">
                            Point camera at the QR code
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-3">
                        <View className="w-8 h-8 rounded-full bg-emerald items-center justify-center">
                          <Text className="text-off-white font-bold text-sm">3</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-off-white font-medium">
                            Auto-receive files
                          </Text>
                          <Text className="text-slate-400 text-sm mt-1">
                            Files save automatically to your device
                          </Text>
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                </View>
              </View>
            ) : showDevices ? (
              /* Nearby Devices List */
              <View className="w-full">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-off-white font-semibold text-xl">
                    Nearby Devices
                  </Text>
                  <TouchableOpacity onPress={() => setShowDevices(false)}>
                    <Text className="text-electric-indigo font-medium">Cancel</Text>
                  </TouchableOpacity>
                </View>
                <DeviceList
                  devices={nearbyDevices}
                  onDevicePress={handleDeviceConnect}
                />
              </View>
            ) : isScanning ? (
              /* Scanning State */
              <GlassCard style={{ padding: 48, alignItems: 'center', width: '100%' }}>
                <View
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: 16,
                    borderWidth: 4,
                    borderColor: '#6366F1',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  }}
                >
                  <Camera size={80} color="#6366F1" />
                </View>
                <Text className="text-off-white font-semibold text-xl mt-6">
                  Scanning...
                </Text>
                <Text className="text-slate-400 text-center text-sm mt-2">
                  Point camera at QR code
                </Text>
              </GlassCard>
            ) : (
              /* Receiving State */
              <GlassCard style={{ padding: 48, alignItems: 'center', width: '100%' }}>
                <ProgressRing progress={progress} speed="45.2 MB/s" size={160} />
                <Text className="text-off-white font-semibold text-xl mt-8">
                  {isPaused ? 'Transfer Paused' : 'Receiving Files'}
                </Text>
                {connectedDevice && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <Wifi size={16} color="#10B981" />
                    <Text className="text-emerald text-sm">
                      From: {connectedDevice.name}
                    </Text>
                  </View>
                )}
                <Text className="text-slate-400 text-center text-sm mt-2">
                  {progress}% complete
                </Text>
                <View className="mt-6 px-6 py-3 bg-emerald/20 rounded-lg">
                  <Text className="text-emerald font-mono text-sm">
                    3 files • 11.3 MB
                  </Text>
                </View>
                <TransferControls
                  isPaused={isPaused}
                  onPause={() => setIsPaused(true)}
                  onResume={() => setIsPaused(false)}
                  onCancel={handleCancelTransfer}
                />
              </GlassCard>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
