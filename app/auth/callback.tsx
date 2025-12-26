/**
 * Auth Callback Screen
 * 
 * This screen handles deep link callbacks from Supabase auth
 * (email confirmation, password reset, etc.)
 */

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying...');

  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[Auth Callback] Params:', params);
        
        // Check if we have tokens in the URL (from email confirmation)
        const accessToken = params.access_token as string | undefined;
        const refreshToken = params.refresh_token as string | undefined;
        const type = params.type as string | undefined;

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('[Auth Callback] Error setting session:', error);
            setStatus('error');
            setMessage(error.message);
            return;
          }

          setStatus('success');
          
          if (type === 'recovery') {
            setMessage('Password reset successful! Redirecting...');
            setTimeout(() => router.replace('/(tabs)/browse'), 1500);
          } else {
            setMessage('Email verified! Redirecting...');
            setTimeout(() => router.replace('/(tabs)/browse'), 1500);
          }
        } else {
          // No tokens, might be a different type of callback
          // Just redirect to login
          setStatus('success');
          setMessage('Redirecting to login...');
          setTimeout(() => router.replace('/login'), 1500);
        }
      } catch (error) {
        console.error('[Auth Callback] Error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View className={`flex-1 ${bg} items-center justify-center px-6`}>
      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={accentColor} />
          <Text
            className={`${primaryText} text-lg mt-6 text-center`}
            style={{ fontFamily: 'Nunito_700Bold' }}
          >
            {message}
          </Text>
        </>
      )}

      {status === 'success' && (
        <>
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: '#4ade8020' }}
          >
            <Text style={{ fontSize: 40 }}>✓</Text>
          </View>
          <Text
            className={`${primaryText} text-xl text-center`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            {message}
          </Text>
        </>
      )}

      {status === 'error' && (
        <>
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: '#ef444420' }}
          >
            <Text style={{ fontSize: 40 }}>✕</Text>
          </View>
          <Text
            className={`${primaryText} text-xl text-center`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            Verification Failed
          </Text>
          <Text
            className={`${secondaryText} text-base text-center mt-3`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            {message}
          </Text>
        </>
      )}
    </View>
  );
}

