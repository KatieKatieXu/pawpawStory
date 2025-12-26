import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { getReadyToHearStories, Story } from '@/constants/stories';
import { useTheme } from '@/contexts/ThemeContext';

// Story Card Component for Ready to Hear
function ReadyStoryCard({ 
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
  const badgeBg = isNightMode ? 'bg-green-800/50' : 'bg-green-100';
  const badgeText = isNightMode ? 'text-green-300' : 'text-green-700';

  return (
    <Pressable
      onPress={onPress}
      className={`${cardBg} rounded-2xl overflow-hidden border-b-4 ${borderColor} mb-4`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Cover Image - Larger for this view */}
      <Image source={story.coverImage} className="w-full h-44" resizeMode="cover" />
      
      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className={`${titleColor} text-xl flex-1`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
            numberOfLines={1}
          >
            {story.title}
          </Text>
          {/* Ready badge */}
          <View className={`${badgeBg} rounded-full px-2 py-1 ml-2`}>
            <Text className={`${badgeText} text-[10px]`} style={{ fontFamily: 'Nunito_700Bold' }}>
              ✓ Ready
            </Text>
          </View>
        </View>
        
        <Text
          className={`${subtitleColor} text-sm mb-3`}
          style={{ fontFamily: 'Nunito_400Regular' }}
          numberOfLines={2}
        >
          {story.description}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color={iconColor} />
              <Text
                className={`${subtitleColor} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                {story.duration}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="person-outline" size={14} color={iconColor} />
              <Text
                className={`${subtitleColor} text-xs`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                {story.narrator}
              </Text>
            </View>
          </View>
          
          <View className={`w-10 h-10 ${playBg} rounded-full items-center justify-center`}>
            <Ionicons name="play" size={18} color={playIcon} style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function ReadyToHearScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  // Get all pre-recorded stories
  const readyStories = getReadyToHearStories();

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';

  // Handle story press - go directly to story (no voice selection needed)
  const handleStoryPress = (story: Story) => {
    router.push({
      pathname: '/story/[id]',
      params: { id: story.id },
    });
  };

  return (
    <View className={`flex-1 ${bg}`}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Back Button + Header */}
        <View className="px-6 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className={`w-11 h-11 rounded-full items-center justify-center ${cardBg} border-b-[3px] ${borderColor} mb-4`}
          >
            <Ionicons name="arrow-back" size={20} color={isNightMode ? '#f8f9fa' : '#3d3630'} />
          </Pressable>
          
          <Text
            className={`${primaryText} text-2xl`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            Ready to Hear
          </Text>
          <Text
            className={`${secondaryText} text-sm mt-2`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Stories pre-recorded by real narrators. Just tap and listen!
          </Text>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className={`${cardBg} rounded-2xl p-4 border-b-[3px] ${borderColor} flex-row items-center`}>
            <View className="w-12 h-12 rounded-full bg-green-500/20 items-center justify-center">
              <Ionicons name="headset" size={24} color={isNightMode ? '#4ade80' : '#22c55e'} />
            </View>
            <View className="ml-4 flex-1">
              <Text
                className={`${primaryText} text-lg`}
                style={{ fontFamily: 'Nunito_800ExtraBold' }}
              >
                {readyStories.length} Stories Available
              </Text>
              <Text
                className={`${secondaryText} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                Professionally narrated, ready to play
              </Text>
            </View>
          </View>
        </View>

        {/* Story List */}
        <View className="px-6">
          {readyStories.map((story) => (
            <ReadyStoryCard
              key={story.id}
              story={story}
              isNightMode={isNightMode}
              onPress={() => handleStoryPress(story)}
            />
          ))}
        </View>

        {/* Empty State */}
        {readyStories.length === 0 && (
          <View className="px-6 py-12 items-center">
            <Ionicons
              name="musical-notes-outline"
              size={48}
              color={isNightMode ? '#7b8fb8' : '#8a7f75'}
            />
            <Text
              className={`${secondaryText} text-base text-center mt-4`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              No pre-recorded stories yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

