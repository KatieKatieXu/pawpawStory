import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export function GlobalHeader() {
  const { isDayMode } = useTheme();
  const insets = useSafeAreaInsets();
  const isNightMode = !isDayMode;

  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';
  const textColor = isNightMode ? '#f8f9fa' : '#3d3630';

  return (
    <View
      className="flex-row items-center justify-between px-6 py-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* Logo - Left aligned */}
      <View className="flex-row items-baseline">
        <Text
          style={{
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 18,
            color: accentColor,
            letterSpacing: -0.36,
          }}
        >
          pawpaw
        </Text>
        <Text
          style={{
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 18,
            color: textColor,
            letterSpacing: -0.36,
          }}
        >
          Story
        </Text>
      </View>

      {/* Theme Toggle - Right aligned */}
      <ThemeToggle />
    </View>
  );
}

