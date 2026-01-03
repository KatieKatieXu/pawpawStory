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
  View
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Apple logo
function AppleLogo({ color }: { color: string }) {
  return (
    <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="logo-apple" size={22} color={color} />
    </View>
  );
}

export default function LoginScreen() {
  const { isDayMode } = useTheme();
  const { signIn, signInWithApple } = useAuth();
  const isNightMode = !isDayMode;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

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
  const iconColor = isNightMode ? '#7b8fb8' : '#8a7f75';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email.trim(), password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)/browse');
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    const { error } = await signInWithApple();
    setIsAppleLoading(false);

    if (error) {
      if (error.message !== 'Sign in was cancelled') {
        Alert.alert('Apple Sign-In Failed', error.message);
      }
    } else {
      router.replace('/(tabs)/browse');
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
          {/* Back Button */}
          <View className="px-6 pt-2">
            <Pressable
              onPress={() => router.back()}
              className={`w-11 h-11 rounded-full items-center justify-center ${cardBg} border-b-[3px] ${borderColor}`}
            >
              <Ionicons name="arrow-back" size={20} color={isNightMode ? '#f8f9fa' : '#3d3630'} />
            </Pressable>
          </View>

          {/* Content */}
          <View className="flex-1 px-6">
            {/* Title Section */}
            <View className="mt-4 mb-6">
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
                    className="px-4 py-3 text-base"
                    style={{ 
                      fontFamily: 'Nunito_400Regular',
                      color: isNightMode ? '#f8f9fa' : '#3d3630',
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor={placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isLoading}
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
                <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder} flex-row items-center`}>
                  <TextInput
                    className="flex-1 px-4 py-3 text-base"
                    style={{ 
                      fontFamily: 'Nunito_400Regular',
                      color: isNightMode ? '#f8f9fa' : '#3d3630',
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    editable={!isLoading}
                  />
                  <Pressable 
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={22} 
                      color={iconColor} 
                    />
                  </Pressable>
                </View>
              </View>

              {/* Forgot Password Link */}
              <Pressable 
                onPress={handleForgotPassword}
                className="self-end active:opacity-70"
                disabled={isLoading}
              >
                <Text
                  className={`${accentColor} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Forgot password?
                </Text>
              </Pressable>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={isLoading || isAppleLoading}
                className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90 mt-4`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                  opacity: isLoading || isAppleLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={isNightMode ? '#1e2749' : '#ffffff'} />
                ) : (
                  <Text
                    className={`${buttonText} text-base text-center tracking-wide`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    LOG IN
                  </Text>
                )}
              </Pressable>

              {/* Apple Sign-In (iOS only) */}
              {Platform.OS === 'ios' && (
                <>
                  <View className="flex-row items-center my-4">
                    <View className={`flex-1 h-[1px] ${isNightMode ? 'bg-pawpaw-border' : 'bg-[#e3d9cf]'}`} />
                    <Text
                      className={`${secondaryText} mx-4 text-sm`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                    >
                      or
                    </Text>
                    <View className={`flex-1 h-[1px] ${isNightMode ? 'bg-pawpaw-border' : 'bg-[#e3d9cf]'}`} />
                  </View>

                  <Pressable
                    onPress={handleAppleSignIn}
                    disabled={isLoading || isAppleLoading}
                    className={`flex-row items-center justify-center ${inputBg} rounded-2xl py-4 border-[1.5px] ${inputBorder}`}
                    style={{ opacity: isAppleLoading ? 0.7 : 1 }}
                  >
                    {isAppleLoading ? (
                      <ActivityIndicator color={isNightMode ? '#f8f9fa' : '#3d3630'} />
                    ) : (
                      <>
                        <AppleLogo color={isNightMode ? '#f8f9fa' : '#000000'} />
                        <Text
                          className={`${primaryText} text-base ml-2`}
                          style={{ fontFamily: 'Nunito_700Bold' }}
                        >
                          Continue with Apple
                        </Text>
                      </>
                    )}
                  </Pressable>
                </>
              )}

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center">
                <Text
                  className={`${secondaryText} text-[15px]`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Don't have an account?
                </Text>
                <Pressable 
                  onPress={() => router.push('/signup')} 
                  className="active:opacity-70"
                  disabled={isLoading}
                >
                  <Text
                    className={`${accentColor} text-[15px] ml-1`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Skip for now */}
            <View className="py-8">
              <Pressable 
                onPress={() => router.replace('/(tabs)/browse')} 
                className="active:opacity-70"
              >
                <Text className="text-center">
                  <Text
                    className={`${accentColor} text-[15px]`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Skip
                  </Text>
                  <Text
                    className={`${secondaryText} text-[15px]`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    {' '}for now, sign up later
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
