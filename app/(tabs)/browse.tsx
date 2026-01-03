import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AVAILABLE_TAGS, getStoriesByTag, getStoriesGroupedByCategory, getTagById, STORIES, Story } from '@/constants/stories';
import { SavedVoice, useSavedVoices } from '@/contexts/SavedVoicesContext';
import { useTheme } from '@/contexts/ThemeContext';


// Quick access items (first row only)
const quickAccessItems = [
  { icon: 'play-circle-outline' as const, label: 'Ready to Hear', color: '#a89179' },
  { icon: 'heart-outline' as const, label: 'Favorites', color: '#c9a892' },
  { icon: 'time-outline' as const, label: 'Continue', color: '#b88a7b' },
];

// Get story categories from centralized data
const storyCategories = getStoriesGroupedByCategory();

// Quick Access Card Component
function QuickAccessCard({ 
  icon, 
  label, 
  color,
  isNightMode,
  onPress,
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  color: string;
  isNightMode: boolean;
  onPress?: () => void;
}) {
  const cardBg = isNightMode ? 'bg-[rgba(43,58,103,0.8)]' : 'bg-[rgba(253,251,248,0.8)]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const textColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 h-[108px] ${cardBg} rounded-2xl border-b-4 ${borderColor} items-center justify-center active:opacity-80`}
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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tag filter state
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get stories filtered by selected tag
  const tagFilteredStories = useMemo(() => {
    if (!selectedTag) return [];
    return getStoriesByTag(selectedTag);
  }, [selectedTag]);
  
  // Filter stories based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return STORIES.filter(
      (story) =>
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  const isSearching = searchQuery.trim().length > 0;

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const tagBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const tagBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const inputBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const inputBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const placeholderColor = isNightMode ? '#7b8fb8' : '#8a7f75';

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
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = selectedTag === tag.id;
            return (
              <Pressable
                key={tag.id}
                onPress={() => {
                  setSelectedTag(isSelected ? null : tag.id);
                  if (!isSelected && searchQuery) {
                    setSearchQuery('');
                  }
                }}
                className={`rounded-full px-4 py-3 border-b-[3px]`}
                style={{
                  backgroundColor: isSelected 
                    ? tag.color 
                    : isNightMode ? '#2b3a67' : '#fdfbf8',
                  borderBottomColor: isSelected
                    ? `${tag.color}cc`
                    : isNightMode ? '#3d4a73' : '#e3d9cf',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  style={{ 
                    fontFamily: 'Nunito_600SemiBold', 
                    fontSize: 14,
                    color: isSelected 
                      ? '#ffffff' 
                      : isNightMode ? '#f8f9fa' : '#3d3630',
                  }}
                >
                  {tag.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Quick Access Section */}
        <View className="px-6 mb-6">
          <Text
            className={`${primaryText} text-base mb-4`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Quick Access
          </Text>
          <View className="flex-row gap-3">
            {quickAccessItems.map((item) => (
              <QuickAccessCard 
                key={item.label} 
                {...item} 
                isNightMode={isNightMode}
                onPress={
                  item.label === 'Continue'
                    ? () => router.push('/continue')
                    : item.label === 'Ready to Hear' 
                      ? () => router.push('/ready-to-hear')
                      : item.label === 'Favorites'
                        ? () => router.push('/favorites')
                        : undefined
                }
              />
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View 
            className={`flex-row items-center ${inputBg} rounded-2xl px-4 py-3 border-b-[3px] ${inputBorder}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Ionicons 
              name="search" 
              size={20} 
              color={placeholderColor} 
              style={{ marginRight: 10 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length > 0 && selectedTag) {
                  setSelectedTag(null);
                }
              }}
              placeholder="Search stories..."
              placeholderTextColor={placeholderColor}
              className={`flex-1 ${primaryText}`}
              style={{ 
                fontFamily: 'Nunito_400Regular', 
                fontSize: 15,
                paddingVertical: 0,
              }}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="ml-2">
                <Ionicons name="close-circle" size={20} color={placeholderColor} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Search Results */}
        {isSearching && (
          <View className="px-6 mb-8">
            <Text
              className={`${primaryText} text-base mb-4`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              {searchResults.length > 0 
                ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'story' : 'stories'}`
                : 'No stories found'
              }
            </Text>
            {searchResults.length > 0 ? (
              <View className="gap-3">
                {searchResults.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    isNightMode={isNightMode}
                    onPress={() => handleStoryPress(story)}
                  />
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons 
                  name="search-outline" 
                  size={48} 
                  color={isNightMode ? '#7b8fb8' : '#8a7f75'} 
                />
                <Text
                  className={`${secondaryText} text-sm text-center mt-4`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  No stories match "{searchQuery}"
                </Text>
                <Text
                  className={`${secondaryText} text-xs text-center mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Try searching by title, description, or category
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tag Filtered Results */}
        {!isSearching && selectedTag && (
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className={`${primaryText} text-base`}
                style={{ fontFamily: 'Nunito_600SemiBold' }}
              >
                {getTagById(selectedTag)?.label} Stories ({tagFilteredStories.length})
              </Text>
              <Pressable 
                onPress={() => setSelectedTag(null)}
                className="flex-row items-center"
              >
                <Text
                  className={`${secondaryText} text-sm mr-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Clear
                </Text>
                <Ionicons 
                  name="close-circle" 
                  size={16} 
                  color={isNightMode ? '#7b8fb8' : '#8a7f75'} 
                />
              </Pressable>
            </View>
            {tagFilteredStories.length > 0 ? (
              <View className="gap-3">
                {tagFilteredStories.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    isNightMode={isNightMode}
                    onPress={() => handleStoryPress(story)}
                  />
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons 
                  name="book-outline" 
                  size={48} 
                  color={isNightMode ? '#7b8fb8' : '#8a7f75'} 
                />
                <Text
                  className={`${secondaryText} text-sm text-center mt-4`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  No stories with this tag yet
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Story Categories - Hidden when searching or filtering by tag */}
        {!isSearching && !selectedTag && storyCategories.map((categoryGroup) => (
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
