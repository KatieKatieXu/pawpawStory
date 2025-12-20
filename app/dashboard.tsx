import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

// Voice data organized by category
const voiceCategories = [
  {
    title: 'Elderly Voices',
    voices: ['Old Grandma', 'Wise Grandfather', 'Kind Uncle', 'Cheerful Mom'],
  },
  {
    title: 'Character Voices',
    voices: ['Young Hero', 'Magical Fairy', 'Brave Knight', 'Wise Wizard'],
  },
  {
    title: 'Narrator Voices',
    voices: ['Gentle Narrator', 'Adventure Guide', 'Bedtime Reader', 'Story Teller'],
  },
];

// Voice card component
function VoiceCard({
  name,
  isSelected,
  onPress,
  isNightMode,
}: {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  isNightMode: boolean;
}) {
  const selectedBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const selectedBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const unselectedBg = isNightMode ? 'bg-[rgba(43,58,103,0.8)]' : 'bg-[rgba(253,251,248,0.8)]';
  const unselectedBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const selectedText = isNightMode ? 'text-pawpaw-navy' : 'text-white';
  const unselectedText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 h-36 rounded-2xl items-center justify-center border-b-4 ${
        isSelected
          ? `${selectedBg} ${selectedBorder}`
          : `${unselectedBg} ${unselectedBorder}`
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text
        className={`text-base text-center px-2 ${
          isSelected ? selectedText : unselectedText
        }`}
        style={{ fontFamily: 'Nunito_700Bold' }}
      >
        {name}
      </Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const bottomBg = isNightMode ? '#1e2749' : '#f5ede6';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';
  const disabledBg = isNightMode ? 'bg-[#374a7f]' : 'bg-[#e3d9cf]';
  const disabledBorder = isNightMode ? 'border-[#2b3a67]' : 'border-[#d1c7bd]';
  const disabledText = isNightMode ? 'text-pawpaw-border' : 'text-[#8a7f75]';

  const toggleVoice = (voice: string) => {
    if (selectedVoices.includes(voice)) {
      setSelectedVoices(selectedVoices.filter((v) => v !== voice));
    } else if (selectedVoices.length < 3) {
      setSelectedVoices([...selectedVoices, voice]);
    }
  };

  const isComplete = selectedVoices.length === 3;

  return (
    <View className={`flex-1 ${bg}`}>

      {/* Title Section */}
      <View className="px-6 py-4">
        <Text
          className={`${primaryText} text-2xl text-center mb-3`}
          style={{ fontFamily: 'Nunito_800ExtraBold' }}
        >
          Choose Your Voices
        </Text>
        <Text
          className={`${secondaryText} text-base text-center opacity-90 px-4`}
          style={{ fontFamily: 'Nunito_700Bold' }}
        >
          Select 3 narrator voices to personalize your storytelling experience
        </Text>
      </View>

      {/* Voice Categories - Scrollable */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {voiceCategories.map((category, categoryIndex) => (
          <View key={category.title} className={categoryIndex > 0 ? 'mt-8' : 'mt-4'}>
            {/* Category Title */}
            <Text
              className={`${secondaryText} text-base opacity-80 mb-5 tracking-wide`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              {category.title}
            </Text>

            {/* Voice Grid - 2 columns */}
            <View className="gap-4">
              {/* Row 1 */}
              <View className="flex-row gap-4">
                <VoiceCard
                  name={category.voices[0]}
                  isSelected={selectedVoices.includes(category.voices[0])}
                  onPress={() => toggleVoice(category.voices[0])}
                  isNightMode={isNightMode}
                />
                <VoiceCard
                  name={category.voices[1]}
                  isSelected={selectedVoices.includes(category.voices[1])}
                  onPress={() => toggleVoice(category.voices[1])}
                  isNightMode={isNightMode}
                />
              </View>
              {/* Row 2 */}
              <View className="flex-row gap-4">
                <VoiceCard
                  name={category.voices[2]}
                  isSelected={selectedVoices.includes(category.voices[2])}
                  onPress={() => toggleVoice(category.voices[2])}
                  isNightMode={isNightMode}
                />
                <VoiceCard
                  name={category.voices[3]}
                  isSelected={selectedVoices.includes(category.voices[3])}
                  onPress={() => toggleVoice(category.voices[3])}
                  isNightMode={isNightMode}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Fixed Section */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-5 pb-10"
        style={{ backgroundColor: bottomBg }}
      >
        {/* Continue Button */}
        <Pressable
          onPress={() => isComplete && router.replace('/(tabs)/browse')}
          className={`rounded-full py-5 items-center justify-center border-b-4 ${
            isComplete
              ? `${buttonBg} ${buttonBorder}`
              : `${disabledBg} ${disabledBorder}`
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text
            className={`text-base ${isComplete ? buttonText : disabledText}`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            Continue ({selectedVoices.length}/3 selected)
          </Text>
        </Pressable>

        {/* Sign up text */}
        <View className="flex-row justify-center mt-3">
          <Text
            className={`${accentColor} text-sm`}
            style={{ fontFamily: 'Nunito_700Bold' }}
          >
            sign up
          </Text>
          <Text
            className={`${secondaryText} text-sm`}
            style={{ fontFamily: 'Nunito_700Bold' }}
          >
            {' '}now to save your preference
          </Text>
        </View>
      </View>
    </View>
  );
}
