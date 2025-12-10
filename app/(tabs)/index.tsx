import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import GlassCard from '@/components/GlassCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { Zap, Shield, Wifi } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-midnight">
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          borderRadius: 150,
        }}
      />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-off-white text-4xl font-bold">Sherim</Text>
            <Text className="text-slate-400 text-base mt-2">
              Ultra-fast file sharing
            </Text>
          </View>

          {/* Connection Status */}
          <ConnectionStatusBanner
            isConnected={false}
            deviceCount={0}
            networkName="Not Connected"
          />

          {/* Feature Cards */}
          <View className="px-4 mt-6">
            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <View className="flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-2xl bg-electric-indigo/20 items-center justify-center">
                  <Zap size={28} color="#6366F1" />
                </View>
                <View className="flex-1">
                  <Text className="text-off-white font-semibold text-lg">
                    Lightning Fast
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    Transfer files at maximum Wi-Fi speed
                  </Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <View className="flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-2xl bg-vivid-purple/20 items-center justify-center">
                  <Shield size={28} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-off-white font-semibold text-lg">
                    Secure & Private
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    Direct peer-to-peer connection
                  </Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <View className="flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-2xl bg-emerald/20 items-center justify-center">
                  <Wifi size={28} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-off-white font-semibold text-lg">
                    No Internet Needed
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    Works offline with local Wi-Fi
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Quick Start Guide */}
          <View className="px-6 mt-8 mb-8">
            <Text className="text-off-white font-semibold text-xl mb-4">
              Quick Start
            </Text>
            <GlassCard style={{ padding: 20 }}>
              <View className="gap-4">
                <View className="flex-row gap-3">
                  <View className="w-8 h-8 rounded-full bg-electric-indigo items-center justify-center">
                    <Text className="text-off-white font-bold text-sm">1</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium">
                      Tap the Send button
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Select files you want to share
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="w-8 h-8 rounded-full bg-vivid-purple items-center justify-center">
                    <Text className="text-off-white font-bold text-sm">2</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium">
                      Generate QR code
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Show it to the receiver
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="w-8 h-8 rounded-full bg-emerald items-center justify-center">
                    <Text className="text-off-white font-bold text-sm">3</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium">
                      Start transfer
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Files transfer automatically
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </View>
        </ScrollView>

        <FloatingActionButton onPress={() => router.push('/send')} />
      </SafeAreaView>
    </View>
  );
}
