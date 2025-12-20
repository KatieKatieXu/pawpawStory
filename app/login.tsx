import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const inputBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const inputBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const inputText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const placeholderColor = isNightMode ? 'rgba(248,249,250,0.5)' : 'rgba(61,54,48,0.5)';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';

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
          {/* Content */}
          <View className="flex-1 px-6">
              {/* Title Section */}
              <View className="mt-8 mb-6">
                <Text
                  className={`${primaryText} text-[32px] leading-[48px]`}
                  style={{ fontFamily: 'Nunito_800ExtraBold' }}
                >
                  Log in
                </Text>
                <Text
                  className={`${secondaryText} text-base mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Welcome back to pawpawStory!
                </Text>
              </View>

              {/* Form Section */}
              <View className="gap-6">
                {/* Email Input */}
                <View className="gap-2">
                  <Text
                    className={`${primaryText} text-sm`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Email
                  </Text>
                  <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                    <TextInput
                      className={`px-4 py-3 ${inputText} text-base`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                      placeholder="Enter your email"
                      placeholderTextColor={placeholderColor}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="gap-2">
                  <Text
                    className={`${primaryText} text-sm`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Password
                  </Text>
                  <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                    <TextInput
                      className={`px-4 py-3 ${inputText} text-base`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                      placeholder="Enter your password"
                      placeholderTextColor={placeholderColor}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Forgot Password Link */}
                <Pressable className="self-end active:opacity-70">
                  <Text
                    className={`${accentColor} text-sm`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Forgot password?
                  </Text>
                </Pressable>

                {/* Login Button */}
                <Pressable
                  onPress={() => router.replace('/(tabs)/browse')}
                  className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90 mt-4`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Text
                    className={`${buttonText} text-base text-center tracking-wide`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    LOG IN
                  </Text>
                </Pressable>

                {/* Sign Up Link */}
                <View className="flex-row justify-center items-center">
                  <Text
                    className={`${secondaryText} text-[15px]`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Don't have an account?
                  </Text>
                  <Pressable onPress={() => router.back()} className="active:opacity-70">
                    <Text
                      className={`${accentColor} text-[15px] ml-1`}
                      style={{ fontFamily: 'Nunito_700Bold' }}
                    >
                      Sign up
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
}
