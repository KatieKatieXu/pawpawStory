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

export default function SignupScreen() {
  const { isDayMode } = useTheme();
  const { signUp, signInWithApple } = useAuth();
  const isNightMode = !isDayMode;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert(
        'Check Your Email',
        'We sent you a confirmation email. Please verify your email to complete sign up.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    }
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
                Create Account
              </Text>
              <Text
                className={`${secondaryText} text-base mt-1`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                Join pawpawStory and start your journey!
              </Text>
            </View>

            {/* Form Section */}
            <View className="gap-5">
              {/* Name Input */}
              <View className="gap-2">
                <Text
                  className={`${primaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Full Name
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
                    className={`flex-1 px-4 py-3 ${inputText} text-base`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                    placeholder="Create a password"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <Pressable 
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4"
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={22} 
                      color={iconColor} 
                    />
                  </Pressable>
                </View>
                <Text
                  className={`${secondaryText} text-xs`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Must be at least 6 characters
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View className="gap-2">
                <Text
                  className={`${primaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Confirm Password
                </Text>
                <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                  <TextInput
                    className={`px-4 py-3 ${inputText} text-base`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                    placeholder="Confirm your password"
                    placeholderTextColor={placeholderColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <Pressable
                onPress={handleSignup}
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
                    CREATE ACCOUNT
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

              {/* Login Link */}
              <View className="flex-row justify-center items-center pb-8">
                <Text
                  className={`${secondaryText} text-[15px]`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Already have an account?
                </Text>
                <Pressable 
                  onPress={() => router.push('/login')} 
                  className="active:opacity-70"
                  disabled={isLoading}
                >
                  <Text
                    className={`${accentColor} text-[15px] ml-1`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Log in
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

