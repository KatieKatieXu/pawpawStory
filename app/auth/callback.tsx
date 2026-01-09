/**
 * Auth Callback Screen
 * 
 * This screen handles deep link callbacks from Supabase auth
 * (email confirmation, password reset, etc.)
 */

import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

// Parse URL fragment for tokens (Supabase sends tokens in #fragment)
function parseUrlFragment(url: string): { accessToken?: string; refreshToken?: string; type?: string } | null {
  try {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return null;
    
    const fragment = url.substring(hashIndex + 1);
    const params = new URLSearchParams(fragment);
    
    return {
      accessToken: params.get('access_token') || undefined,
      refreshToken: params.get('refresh_token') || undefined,
      type: params.get('type') || undefined,
    };
  } catch {
    return null;
  }
}

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

  // Process URL and extract tokens
  const processUrl = (url: string) => {
    console.log('[Auth Callback] Processing URL:', url);
    const fragmentParams = parseUrlFragment(url);
    
    if (fragmentParams?.accessToken && fragmentParams?.refreshToken) {
      console.log('[Auth Callback] Found tokens, type:', fragmentParams.type);
      
      if (fragmentParams.type === 'recovery') {
        console.log('[Auth Callback] RECOVERY - Redirecting to reset-password');
        router.replace({
          pathname: '/reset-password',
          params: {
            access_token: fragmentParams.accessToken,
            refresh_token: fragmentParams.refreshToken,
          },
        });
        return true;
      } else {
        // Handle other auth types (email confirmation)
        handleOtherAuth(fragmentParams.accessToken, fragmentParams.refreshToken);
        return true;
      }
    }
    return false;
  };

  const handleOtherAuth = async (accessToken: string, refreshToken: string) => {
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
    setMessage('Email verified! Redirecting...');
    setTimeout(() => router.replace('/(tabs)/browse'), 1500);
  };

  useEffect(() => {
    let isMounted = true;
    let loginTimer: NodeJS.Timeout | null = null;
    
    const handleCallback = async () => {
      try {
        console.log('[Auth Callback] Params from router:', params);
        
        // First check if we have params from router (passed from _layout.tsx)
        const accessToken = params.access_token as string | undefined;
        const refreshToken = params.refresh_token as string | undefined;
        const type = params.type as string | undefined;

        if (accessToken && refreshToken) {
          console.log('[Auth Callback] Using router params, type:', type);
          
          if (type === 'recovery') {
            console.log('[Auth Callback] RECOVERY from params - Redirecting to reset-password');
            router.replace({
              pathname: '/reset-password',
              params: {
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            });
            return;
          }
          
          await handleOtherAuth(accessToken, refreshToken);
          return;
        }

        // Try to get URL from initial URL
        const initialUrl = await Linking.getInitialURL();
        console.log('[Auth Callback] Initial URL:', initialUrl);
        
        if (initialUrl && processUrl(initialUrl)) {
          return;
        }

        // If still no tokens, wait a moment and check again (app might still be loading)
        if (!isMounted) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        const retryUrl = await Linking.getInitialURL();
        console.log('[Auth Callback] Retry URL:', retryUrl);
        
        if (retryUrl && processUrl(retryUrl)) {
          return;
        }

        // No tokens found - redirect to login after delay (only if still mounted)
        if (!isMounted) return;
        console.log('[Auth Callback] No tokens found, redirecting to login');
        setStatus('success');
        setMessage('Redirecting to login...');
        loginTimer = setTimeout(() => {
          if (isMounted) {
            router.replace('/login');
          }
        }, 1500);
        
      } catch (error) {
        console.error('[Auth Callback] Error:', error);
        if (isMounted) {
          setStatus('error');
          setMessage('Something went wrong. Please try again.');
        }
      }
    };

    handleCallback();

    // Also listen for URL events (in case app was in background)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('[Auth Callback] URL event received:', url);
      processUrl(url);
    });

    return () => {
      isMounted = false;
      if (loginTimer) clearTimeout(loginTimer);
      subscription.remove();
    };
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

