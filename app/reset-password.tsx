/**
 * Reset Password Screen
 * 
 * This screen allows users to set a new password after clicking the reset link.
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const { isDayMode } = useTheme();
  const params = useLocalSearchParams();
  const isNightMode = !isDayMode;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const inputBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const inputBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const placeholderColor = isNightMode ? 'rgba(248,249,250,0.5)' : 'rgba(61,54,48,0.5)';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  // Verify the session from URL tokens - only run once
  useEffect(() => {
    // Prevent running multiple times
    if (hasVerified) return;
    
    const verifySession = async () => {
      setHasVerified(true); // Mark as verified to prevent re-runs
      
      try {
        console.log('[ResetPassword] Params:', params);
        console.log('[ResetPassword] access_token present:', !!params.access_token);
        console.log('[ResetPassword] refresh_token present:', !!params.refresh_token);
        
        const accessToken = params.access_token as string | undefined;
        const refreshToken = params.refresh_token as string | undefined;

        if (accessToken && refreshToken) {
          console.log('[ResetPassword] Setting session with tokens...');
          
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('[ResetPassword] Session error:', error);
            Alert.alert(
              'Link Expired',
              'This password reset link has expired. Please request a new one.',
              [{ text: 'OK', onPress: () => router.replace('/forgot-password') }]
            );
            return;
          }

          console.log('[ResetPassword] Session set successfully for:', data?.user?.email);
          setSessionReady(true);
        } else {
          // Check if user already has an active session (might have been set by _layout.tsx)
          console.log('[ResetPassword] No tokens in params, checking existing session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('[ResetPassword] Found existing session for:', session.user?.email);
            setSessionReady(true);
          } else {
            console.log('[ResetPassword] No session found');
            Alert.alert(
              'Invalid Link',
              'This password reset link is invalid. Please request a new one.',
              [{ text: 'OK', onPress: () => router.replace('/forgot-password') }]
            );
          }
        }
      } catch (error) {
        console.error('[ResetPassword] Error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [hasVerified]); // Only depend on hasVerified flag

  const handleResetPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a new password');
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
    
    try {
      // Check current session before update
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[ResetPassword] Current session before update:', session?.user?.email);
      
      if (!session) {
        Alert.alert('Session Expired', 'Your session has expired. Please request a new password reset link.');
        router.replace('/forgot-password');
        return;
      }

      // Update the password
      console.log('[ResetPassword] Attempting to update password...');
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      console.log('[ResetPassword] Update result - data:', data?.user?.email, 'error:', error?.message);

      if (error) {
        console.error('[ResetPassword] Update error:', error);
        Alert.alert('Error', error.message);
      } else {
        console.log('[ResetPassword] Password updated successfully!');
        
        // Sign out to ensure clean state for next login
        await supabase.auth.signOut();
        
        Alert.alert(
          'Password Updated! 🎉',
          'Your password has been successfully changed. You can now log in with your new password.',
          [{ text: 'Go to Login', onPress: () => router.replace('/login') }]
        );
      }
    } catch (error) {
      console.error('[ResetPassword] Exception:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <View className={`flex-1 ${bg} items-center justify-center`}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text
          className={`${primaryText} text-lg mt-6`}
          style={{ fontFamily: 'Nunito_700Bold' }}
        >
          Verifying reset link...
        </Text>
      </View>
    );
  }

  if (!sessionReady) {
    return null; // Will redirect via Alert
  }

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
          <View className="flex-1 px-6 pt-16">
            {/* Icon */}
            <View className="items-center mb-8">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Ionicons name="lock-open" size={40} color={accentColor} />
              </View>
            </View>

            {/* Title */}
            <Text
              className={`${primaryText} text-[32px] text-center`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Set New Password
            </Text>
            <Text
              className={`${secondaryText} text-base text-center mt-2 mb-8`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Enter your new password below
            </Text>

            {/* Form */}
            <View className="gap-5">
              {/* New Password */}
              <View className="gap-2">
                <Text
                  className={`${primaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  New Password
                </Text>
                <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder} flex-row items-center`}>
                  <TextInput
                    className="flex-1 px-4 py-3 text-base"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      color: isNightMode ? '#f8f9fa' : '#3d3630',
                    }}
                    placeholder="Enter new password"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!isLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color={isNightMode ? '#c4cfdb' : '#8a7f75'}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="gap-2">
                <Text
                  className={`${primaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Confirm Password
                </Text>
                <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                  <TextInput
                    className="px-4 py-3 text-base"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      color: isNightMode ? '#f8f9fa' : '#3d3630',
                    }}
                    placeholder="Confirm new password"
                    placeholderTextColor={placeholderColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleResetPassword}
                disabled={isLoading}
                className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90 mt-4`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={isNightMode ? '#1e2749' : '#ffffff'} />
                ) : (
                  <Text
                    className={`${buttonText} text-base text-center tracking-wide`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    UPDATE PASSWORD
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
