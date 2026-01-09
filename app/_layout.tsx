import "@/global.css";
import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { GlobalHeader } from '@/components/GlobalHeader';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { PlaybackProgressProvider } from '@/contexts/PlaybackProgressContext';
import { SavedVoicesProvider } from '@/contexts/SavedVoicesContext';
import { ThemeContextProvider, useTheme } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  // Background color for the entire app
  const bgColor = isNightMode ? '#1e2749' : '#f5ede6';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: bgColor }} className={isDayMode ? 'theme-day' : ''}>
        {/* Global Header - Logo left, Toggle right - same position on ALL screens */}
        <GlobalHeader />

        {/* Main content */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </View>
      <StatusBar style={isDayMode ? 'dark' : 'light'} />
    </ThemeProvider>
  );
}

// Parse URL fragments from Supabase auth links
function parseSupabaseAuthUrl(url: string): { type?: string; accessToken?: string; refreshToken?: string } | null {
  try {
    // Supabase sends tokens in URL fragment: #access_token=...&refresh_token=...&type=recovery
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return null;
    
    const fragment = url.substring(hashIndex + 1);
    const params = new URLSearchParams(fragment);
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');
    
    if (accessToken && refreshToken) {
      return { type: type || undefined, accessToken, refreshToken };
    }
    return null;
  } catch {
    return null;
  }
}

// Track handled URLs to prevent duplicate processing
let handledUrls = new Set<string>();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Handle deep links with URL fragments (Supabase auth)
  useEffect(() => {
    const handleAuthUrl = (url: string) => {
      // Skip if we've already handled this URL
      if (handledUrls.has(url)) {
        console.log('[DeepLink] URL already handled, skipping:', url);
        return;
      }
      
      const authParams = parseSupabaseAuthUrl(url);
      if (authParams) {
        // Mark URL as handled
        handledUrls.add(url);
        
        console.log('[DeepLink] Auth params found:', authParams.type);
        if (authParams.type === 'recovery') {
          router.replace({
            pathname: '/reset-password',
            params: {
              access_token: authParams.accessToken,
              refresh_token: authParams.refreshToken,
            },
          });
        } else {
          router.replace({
            pathname: '/auth/callback',
            params: {
              access_token: authParams.accessToken,
              refresh_token: authParams.refreshToken,
              type: authParams.type || '',
            },
          });
        }
      }
    };

    // Handle initial URL (app opened via link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('[DeepLink] Initial URL:', url);
        handleAuthUrl(url);
      }
    });

    // Handle URL changes while app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('[DeepLink] URL event:', url);
      handleAuthUrl(url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <SavedVoicesProvider>
          <FavoritesProvider>
            <PlaybackProgressProvider>
              <RootLayoutContent />
            </PlaybackProgressProvider>
          </FavoritesProvider>
        </SavedVoicesProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
