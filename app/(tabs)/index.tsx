import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export default function WelcomeScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';

  return (
    <View className={`flex-1 ${bg}`}>
      <View className="flex-1 px-6">
        {/* Main Content - Centered */}
        <View className="flex-1 justify-center items-center -mt-20">
          {/* Logo */}
          <View className="opacity-85 mb-4">
            <Image
              source={require('@/assets/images/pawpaw-logo.png')}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>

          {/* Word Logo */}
          <View className="flex-row items-baseline mb-4">
            <Text
              className={`${accentColor} text-[44px] font-nunito-extrabold tracking-tighter`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              pawpaw
            </Text>
            <Text
              className={`${primaryText} text-[44px] font-nunito-extrabold tracking-tighter`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Story
            </Text>
          </View>

          {/* Tagline */}
          <Text
            className={`${secondaryText} text-[15px] opacity-60 text-center`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Storyreading that inspires and bonds
          </Text>
        </View>

        {/* Bottom Buttons */}
        <View className="pb-28 gap-3">
          {/* Get Started Button */}
          <Pressable
            onPress={() => router.replace('/(tabs)/browse')}
            className={`${buttonBg} rounded-2xl py-[18px] border-b-[4px] ${buttonBorder} active:opacity-90`}
          >
            <Text
              className={`${buttonText} text-base text-center`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              GET STARTED
            </Text>
          </Pressable>

          {/* Login / Sign up Button */}
          <Pressable
            onPress={() => router.push('/login')}
            className="rounded-2xl py-[18px] active:opacity-70"
          >
            <Text
              className={`${accentColor} text-base text-center`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Log in / Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
