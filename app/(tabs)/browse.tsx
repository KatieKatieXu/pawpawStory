import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { getStoriesGroupedByCategory, Story } from '@/constants/stories';
import { SavedVoice, useSavedVoices } from '@/contexts/SavedVoicesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Category tags data
const categoryTags = [
  'sleepy winds',
  'cozy house',
  'hero arc',
  'fear management',
  'dreamland',
  'gentle rain',
];

// Quick access items
const quickAccessItems = [
  { icon: 'time-outline' as const, label: 'Continue', color: '#b88a7b' },
  { icon: 'heart-outline' as const, label: 'Favorites', color: '#c9a892' },
  { icon: 'trending-up-outline' as const, label: 'Popular', color: '#a89179' },
  { icon: 'sparkles-outline' as const, label: 'New', color: '#9b9682' },
  { icon: 'flash-outline' as const, label: 'Quick', color: '#b09a88' },
  { icon: 'book-outline' as const, label: 'Classics', color: '#8e9c92' },
  { icon: 'moon-outline' as const, label: 'Bedtime', color: '#c0aa8e' },
  { icon: 'star-outline' as const, label: "Joey's Fav", color: '#d4af37' },
  { icon: 'add-outline' as const, label: 'Add', color: '#9b7265' },
];

// Get story categories from centralized data
const storyCategories = getStoriesGroupedByCategory();

// Quick Access Card Component
function QuickAccessCard({ 
  icon, 
  label, 
  color,
  isNightMode,
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  color: string;
  isNightMode: boolean;
}) {
  const cardBg = isNightMode ? 'bg-[rgba(43,58,103,0.8)]' : 'bg-[rgba(253,251,248,0.8)]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const textColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';

  return (
    <Pressable
      className={`flex-1 h-[108px] ${cardBg} rounded-2xl border-b-4 ${borderColor} items-center justify-center`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text
        className={`${textColor} text-xs text-center`}
        style={{ fontFamily: 'Nunito_400Regular' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Story Card Component
function StoryCard({ 
  story, 
  isNightMode,
  onPress,
}: { 
  story: Story; 
  isNightMode: boolean;
  onPress: () => void;
}) {
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const titleColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const subtitleColor = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const playBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const playIcon = isNightMode ? '#1e2749' : '#ffffff';
  const iconColor = isNightMode ? '#c4cfdb' : '#8a7f75';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row ${cardBg} rounded-2xl overflow-hidden border-b-4 ${borderColor}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Image source={story.coverImage} className="w-24 h-24" resizeMode="cover" />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text
            className={`${titleColor} text-lg`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
            numberOfLines={1}
          >
            {story.title}
          </Text>
          <Text
            className={`${subtitleColor} text-sm`}
            style={{ fontFamily: 'Nunito_700Bold' }}
            numberOfLines={1}
          >
            {story.description}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={12} color={iconColor} />
            <Text
              className={`${subtitleColor} text-xs`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              {story.duration}
            </Text>
          </View>
          <View className={`${isNightMode ? 'bg-pawpaw-navyLight/50' : 'bg-[#f5ede6]'} rounded-full px-2 py-0.5 mr-2`}>
            <Text className={`${subtitleColor} text-[10px]`} style={{ fontFamily: 'Nunito_400Regular' }}>
              {story.narrator}
            </Text>
          </View>
          <View className={`w-6 h-6 ${playBg} rounded-full items-center justify-center`}>
            <Ionicons name="play" size={12} color={playIcon} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Voice Avatar Component for the bottom sheet
function VoiceAvatar({
  voice,
  isNightMode,
  onPress,
}: {
  voice: SavedVoice;
  isNightMode: boolean;
  onPress: () => void;
}) {
  const avatarBg = isNightMode ? '#2b3a67' : '#e3d9cf';
  const textColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  // Generate initials from name
  const initials = voice.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Pressable onPress={onPress} className="items-center mx-3">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{
          backgroundColor: avatarBg,
          borderWidth: 3,
          borderColor: accentColor,
        }}
      >
        <Text
          className={textColor}
          style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 20 }}
        >
          {initials}
        </Text>
      </View>
      <Text
        className={`${textColor} text-sm text-center`}
        style={{ fontFamily: 'Nunito_700Bold' }}
        numberOfLines={1}
      >
        {voice.name}
      </Text>
    </Pressable>
  );
}

// Voice Selector Modal Component
function VoiceSelectorModal({
  visible,
  story,
  voices,
  isNightMode,
  onSelectVoice,
  onCancel,
}: {
  visible: boolean;
  story: Story | null;
  voices: SavedVoice[];
  isNightMode: boolean;
  onSelectVoice: (voice: SavedVoice) => void;
  onCancel: () => void;
}) {
  const modalBg = isNightMode ? '#1e2749' : '#f5ede6';
  const cardBg = isNightMode ? '#2b3a67' : '#fdfbf8';
  const titleColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const subtitleColor = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const borderColor = isNightMode ? '#3d4a73' : '#e3d9cf';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  if (!story) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {/* Bottom Sheet */}
        <View
          style={{
            backgroundColor: modalBg,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingBottom: 40,
          }}
        >
          {/* Handle bar */}
          <View className="items-center pt-3 pb-2">
            <View
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: borderColor }}
            />
          </View>

          {/* Header */}
          <View className="px-6 pt-4 pb-2">
            <Text
              className={`${titleColor} text-xl text-center`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Who will read this story?
            </Text>
            <Text
              className={`${subtitleColor} text-sm text-center mt-2`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Select a voice to narrate "{story.title}"
            </Text>
          </View>

          {/* Voices Row */}
          <View className="py-6">
            {voices.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
              >
                {voices.map((voice) => (
                  <VoiceAvatar
                    key={voice.id}
                    voice={voice}
                    isNightMode={isNightMode}
                    onPress={() => onSelectVoice(voice)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="px-6 py-8 items-center">
                <Ionicons
                  name="mic-off-outline"
                  size={40}
                  color={isNightMode ? '#7b8fb8' : '#8a7f75'}
                />
                <Text
                  className={`${subtitleColor} text-base text-center mt-4`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  No voices saved yet.
                </Text>
                <Text
                  className={`${subtitleColor} text-sm text-center mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Go to the Record tab to create your first voice!
                </Text>
                <Pressable
                  onPress={() => {
                    onCancel();
                    router.push('/(tabs)/record');
                  }}
                  className="mt-4 px-6 py-3 rounded-full"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text
                    className="text-white text-sm"
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Record a Voice
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Cancel Button */}
          <View className="px-6">
            <Pressable
              onPress={onCancel}
              className="h-14 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: cardBg,
                borderWidth: 2,
                borderColor: borderColor,
              }}
            >
              <Text
                className={`${titleColor} text-base`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function BrowseScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;
  
  // Get saved voices from shared context
  const { savedVoices } = useSavedVoices();
  
  // State for the voice selector modal
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const tagBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const tagBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';

  // Handle story card press - opens the voice selector modal
  const handleStoryPress = (story: Story) => {
    setSelectedStory(story);
  };

  // Handle voice selection - navigates to story with voiceId
  const handleSelectVoice = (voice: SavedVoice) => {
    if (selectedStory) {
      router.push({
        pathname: '/story/[id]',
        params: { 
          id: selectedStory.id, 
          voiceId: voice.voiceId || voice.id,
        },
      });
      setSelectedStory(null);
    }
  };

  // Handle cancel - closes the modal
  const handleCancelModal = () => {
    setSelectedStory(null);
  };

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Category Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {categoryTags.map((tag) => (
            <View
              key={tag}
              className={`${tagBg} rounded-full px-4 py-3 border-b-[3px] ${tagBorder}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text
                className={primaryText}
                style={{ fontFamily: 'Nunito_400Regular', fontSize: 14 }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Access Section */}
        <View className="px-6 mb-6">
          <Text
            className={`${primaryText} text-base mb-4`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Quick Access
          </Text>
          <View className="gap-3">
            {/* Row 1 */}
            <View className="flex-row gap-3">
              {quickAccessItems.slice(0, 3).map((item) => (
                <QuickAccessCard key={item.label} {...item} isNightMode={isNightMode} />
              ))}
            </View>
            {/* Row 2 */}
            <View className="flex-row gap-3">
              {quickAccessItems.slice(3, 6).map((item) => (
                <QuickAccessCard key={item.label} {...item} isNightMode={isNightMode} />
              ))}
            </View>
            {/* Row 3 */}
            <View className="flex-row gap-3">
              {quickAccessItems.slice(6, 9).map((item) => (
                <QuickAccessCard key={item.label} {...item} isNightMode={isNightMode} />
              ))}
            </View>
          </View>
        </View>

        {/* Story Categories */}
        {storyCategories.map((categoryGroup) => (
          <View key={categoryGroup.category} className="px-6 mb-8">
            <Text
              className={`${primaryText} text-base mb-4 capitalize`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              {categoryGroup.category}
            </Text>
            <View className="gap-3">
              {categoryGroup.stories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  isNightMode={isNightMode}
                  onPress={() => handleStoryPress(story)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Voice Selector Modal */}
      <VoiceSelectorModal
        visible={selectedStory !== null}
        story={selectedStory}
        voices={savedVoices}
        isNightMode={isNightMode}
        onSelectVoice={handleSelectVoice}
        onCancel={handleCancelModal}
      />
    </View>
  );
}
