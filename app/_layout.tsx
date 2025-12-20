import "@/global.css";
import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { GlobalHeader } from '@/components/GlobalHeader';
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

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

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
      <SavedVoicesProvider>
        <RootLayoutContent />
      </SavedVoicesProvider>
    </ThemeContextProvider>
  );
}
