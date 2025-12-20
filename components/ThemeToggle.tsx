import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '@/contexts/ThemeContext';

function SunIcon({ color = '#c4cfdb' }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={2} />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MoonIcon({ color = '#c4cfdb' }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ThemeToggle() {
  const { isDayMode, toggleTheme } = useTheme();
  const translateX = useSharedValue(isDayMode ? 0 : 18);

  const handleToggle = () => {
    translateX.value = withSpring(isDayMode ? 18 : 0, {
      damping: 15,
      stiffness: 120,
    });
    toggleTheme();
  };

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Day mode: cream background, orange accents
  // Night mode: navy background, yellow accents
  const bgColor = isDayMode ? '#fdfbf8' : 'rgba(43, 58, 103, 0.9)';
  const borderColor = isDayMode ? '#e3d9cf' : '#7b8fb8';
  const trackColor = isDayMode ? '#e3d9cf' : '#ffd166';
  const iconColor = isDayMode ? '#8a7f75' : '#c4cfdb';

  return (
    <Pressable
      onPress={handleToggle}
      className="flex-row items-center rounded-full px-2 py-1.5"
      style={{
        backgroundColor: bgColor,
        borderBottomWidth: 2,
        borderBottomColor: borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <SunIcon color={iconColor} />
      <View
        className="mx-1.5 w-9 h-5 rounded-full justify-center px-0.5"
        style={{ backgroundColor: trackColor }}
      >
        <Animated.View
          className="w-4 h-4 rounded-full"
          style={[
            { backgroundColor: isDayMode ? '#fdfbf8' : '#fdfbf8' },
            animatedKnobStyle,
          ]}
        />
      </View>
      <MoonIcon color={iconColor} />
    </Pressable>
  );
}

