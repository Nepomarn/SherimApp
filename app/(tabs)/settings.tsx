import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import StorageIndicator from '@/components/StorageIndicator';
import {
  Moon,
  Bell,
  Wifi,
  HardDrive,
  Info,
  ChevronRight,
  Shield,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    // Add smooth theme transition logic here
  };

  return (
    <View className="flex-1 bg-midnight">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-off-white text-3xl font-bold">Settings</Text>
            <Text className="text-slate-400 text-base mt-2">
              Customize your experience
            </Text>
          </View>

          {/* Appearance Section */}
          <View className="px-4 mt-4">
            <Text className="text-off-white font-semibold text-lg mb-3 px-2">
              Appearance
            </Text>
            <GlassCard style={{ padding: 16 }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-xl bg-electric-indigo/20 items-center justify-center">
                    <Moon size={20} color="#6366F1" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium text-base">
                      Dark Mode
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Use dark theme
                    </Text>
                  </View>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: '#1A1F3A', true: '#6366F1' }}
                  thumbColor="#F8FAFC"
                />
              </View>
            </GlassCard>
          </View>

          {/* Notifications Section */}
          <View className="px-4 mt-6">
            <Text className="text-off-white font-semibold text-lg mb-3 px-2">
              Notifications
            </Text>
            <GlassCard style={{ padding: 16 }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-xl bg-vivid-purple/20 items-center justify-center">
                    <Bell size={20} color="#8B5CF6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium text-base">
                      Transfer Notifications
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Get notified on completion
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#1A1F3A', true: '#8B5CF6' }}
                  thumbColor="#F8FAFC"
                />
              </View>
            </GlassCard>
          </View>

          {/* Transfer Settings */}
          <View className="px-4 mt-6">
            <Text className="text-off-white font-semibold text-lg mb-3 px-2">
              Transfer Settings
            </Text>

            {/* Storage Indicator */}
            <View className="mb-3">
              <StorageIndicator usedSpace={45.8} totalSpace={64} />
            </View>

            <GlassCard style={{ padding: 16, marginBottom: 12 }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-xl bg-emerald/20 items-center justify-center">
                    <HardDrive size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-off-white font-medium text-base">
                      Auto-save Files
                    </Text>
                    <Text className="text-slate-400 text-sm mt-1">
                      Save received files automatically
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoSave}
                  onValueChange={setAutoSave}
                  trackColor={{ false: '#1A1F3A', true: '#10B981' }}
                  thumbColor="#F8FAFC"
                />
              </View>
            </GlassCard>

            <TouchableOpacity activeOpacity={0.7}>
              <GlassCard style={{ padding: 16 }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-xl bg-electric-indigo/20 items-center justify-center">
                      <Wifi size={20} color="#6366F1" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-off-white font-medium text-base">
                        Network Settings
                      </Text>
                      <Text className="text-slate-400 text-sm mt-1">
                        Configure Wi-Fi hotspot
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* Security & Privacy */}
          <View className="px-4 mt-6">
            <Text className="text-off-white font-semibold text-lg mb-3 px-2">
              Security & Privacy
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <GlassCard style={{ padding: 16 }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-xl bg-amber/20 items-center justify-center">
                      <Shield size={20} color="#F59E0B" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-off-white font-medium text-base">
                        Privacy Policy
                      </Text>
                      <Text className="text-slate-400 text-sm mt-1">
                        View our privacy policy
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="px-4 mt-6 mb-8">
            <Text className="text-off-white font-semibold text-lg mb-3 px-2">
              About
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <GlassCard style={{ padding: 16 }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-xl bg-slate-400/20 items-center justify-center">
                      <Info size={20} color="#94A3B8" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-off-white font-medium text-base">
                        App Information
                      </Text>
                      <Text className="text-slate-400 text-sm mt-1">
                        Version 1.0.0
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* App Info Footer */}
          <View className="px-6 pb-8 items-center">
            <Text className="text-slate-400 text-sm text-center">
              Sherim - Ultra-Fast File Sharing
            </Text>
            <Text className="text-slate-400 text-xs text-center mt-2">
              Made with ❤️ for seamless sharing
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
