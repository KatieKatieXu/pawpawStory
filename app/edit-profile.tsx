import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function EditProfileScreen() {
  const { isDayMode } = useTheme();
  const { user } = useAuth();
  const isNightMode = !isDayMode;

  // Get current user data
  const currentName = user?.user_metadata?.apple_name || 
                      user?.user_metadata?.full_name || 
                      '';
  const currentEmail = user?.email || '';
  
  // Check if user signed in with email (not Apple/OAuth)
  const isEmailUser = user?.app_metadata?.provider === 'email';

  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const inputBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const inputBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const inputText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const placeholderColor = isNightMode ? 'rgba(248,249,250,0.5)' : 'rgba(61,54,48,0.5)';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';
  const iconColor = isNightMode ? '#ffd166' : '#ff8c42';

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Your profile has been updated', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = name.trim() !== currentName;

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Your password has been updated');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <View className={`flex-1 ${bg}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center px-6 pt-4 pb-6">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full"
              style={{ backgroundColor: isNightMode ? '#2b3a67' : '#e3d9cf' }}
            >
              <Ionicons name="arrow-back" size={22} color={iconColor} />
            </Pressable>
            <Text
              className={`${primaryText} text-xl flex-1 text-center mr-10`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Edit Profile
            </Text>
          </View>

          {/* Avatar Section */}
          <View className="items-center mb-8">
            <View
              className="w-28 h-28 rounded-full items-center justify-center"
              style={{ backgroundColor: isNightMode ? '#2b3a67' : '#e3d9cf' }}
            >
              <Ionicons name="person" size={56} color={iconColor} />
            </View>
            <Pressable className="mt-3">
              <Text
                className={`text-sm ${isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]'}`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Change Photo
              </Text>
            </Pressable>
          </View>

          {/* Form Section */}
          <View className="px-6 gap-6">
            {/* Name Input */}
            <View className="gap-2">
              <Text
                className={`${primaryText} text-sm`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Name
              </Text>
              <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                <TextInput
                  className={`px-4 py-3 ${inputText} text-base`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                  placeholder="Enter your name"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email (Read-only) */}
            <View className="gap-2">
              <Text
                className={`${primaryText} text-sm`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Email
              </Text>
              <View className={`${cardBg} rounded-2xl border-[1.5px] ${inputBorder} opacity-60`}>
                <TextInput
                  className={`px-4 py-3 ${inputText} text-base`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                  value={currentEmail}
                  editable={false}
                />
              </View>
              <Text
                className={`${secondaryText} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                Email cannot be changed
              </Text>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isLoading || !hasChanges}
              className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90 mt-6`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
                opacity: isLoading || !hasChanges ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={isNightMode ? '#1e2749' : '#ffffff'} />
              ) : (
                <Text
                  className={`${buttonText} text-base text-center tracking-wide`}
                  style={{ fontFamily: 'Nunito_800ExtraBold' }}
                >
                  SAVE CHANGES
                </Text>
              )}
            </Pressable>

            {/* Change Password Section - Only for email users */}
            {isEmailUser && (
              <View className="mt-10">
                {/* Divider */}
                <View className="flex-row items-center mb-6">
                  <View className={`flex-1 h-[1px] ${isNightMode ? 'bg-pawpaw-border' : 'bg-[#e3d9cf]'}`} />
                  <Text
                    className={`${secondaryText} mx-4 text-sm`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Change Password
                  </Text>
                  <View className={`flex-1 h-[1px] ${isNightMode ? 'bg-pawpaw-border' : 'bg-[#e3d9cf]'}`} />
                </View>

                {/* New Password */}
                <View className="gap-2 mb-4">
                  <Text
                    className={`${primaryText} text-sm`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    New Password
                  </Text>
                  <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder} flex-row items-center`}>
                    <TextInput
                      className={`flex-1 px-4 py-3 ${inputText} text-base`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                      placeholder="Enter new password"
                      placeholderTextColor={placeholderColor}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      editable={!isPasswordLoading}
                    />
                    <Pressable 
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      className="px-4"
                    >
                      <Ionicons 
                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={22} 
                        color={isNightMode ? '#7b8fb8' : '#8a7f75'} 
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password */}
                <View className="gap-2 mb-6">
                  <Text
                    className={`${primaryText} text-sm`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Confirm New Password
                  </Text>
                  <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder} flex-row items-center`}>
                    <TextInput
                      className={`flex-1 px-4 py-3 ${inputText} text-base`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                      placeholder="Confirm new password"
                      placeholderTextColor={placeholderColor}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isPasswordLoading}
                    />
                    <Pressable 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="px-4"
                    >
                      <Ionicons 
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                        size={22} 
                        color={isNightMode ? '#7b8fb8' : '#8a7f75'} 
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Update Password Button */}
                <Pressable
                  onPress={handleChangePassword}
                  disabled={isPasswordLoading || !newPassword || !confirmPassword}
                  className={`${cardBg} rounded-2xl py-[18px] border-2 ${inputBorder} active:opacity-90`}
                  style={{
                    opacity: isPasswordLoading || !newPassword || !confirmPassword ? 0.5 : 1,
                  }}
                >
                  {isPasswordLoading ? (
                    <ActivityIndicator color={iconColor} />
                  ) : (
                    <Text
                      className={`${primaryText} text-base text-center tracking-wide`}
                      style={{ fontFamily: 'Nunito_700Bold' }}
                    >
                      UPDATE PASSWORD
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

