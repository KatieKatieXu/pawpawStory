import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { getStoryById, Story } from '@/constants/stories';
import { PlaybackProgress, usePlaybackProgress } from '@/contexts/PlaybackProgressContext';
import { useTheme } from '@/contexts/ThemeContext';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Continue Story Card Component
function ContinueStoryCard({ 
  story,
  progress,
  isNightMode,
  onPress,
  onClear,
}: { 
  story: Story;
  progress: PlaybackProgress;
  isNightMode: boolean;
  onPress: () => void;
  onClear: () => void;
}) {
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const titleColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const subtitleColor = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const playBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const playIcon = isNightMode ? '#1e2749' : '#ffffff';
  const progressBg = isNightMode ? 'bg-pawpaw-navyLight/80' : 'bg-[#e3d9cf]';
  const progressFill = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';

  const progressPercent = progress.durationMs > 0 
    ? (progress.positionMs / progress.durationMs) * 100 
    : 0;
  
  const timeLeft = progress.durationMs - progress.positionMs;

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
      <View className="flex-row">
        {/* Cover Image */}
        <Image source={story.coverImage} className="w-28 h-28" resizeMode="cover" />
        
        {/* Content */}
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
              className={`${subtitleColor} text-xs mt-1`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              {formatTime(timeLeft)} left
            </Text>
          </View>
          
          {/* Progress bar */}
          <View className="mt-2">
            <View className={`h-2 rounded-full ${progressBg}`}>
              <View 
                className={`h-full rounded-full ${progressFill}`}
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text
                className={`${subtitleColor} text-[10px]`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                {formatTime(progress.positionMs)}
              </Text>
              <Text
                className={`${subtitleColor} text-[10px]`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                {formatTime(progress.durationMs)}
              </Text>
            </View>
          </View>
        </View>

        {/* Play button */}
        <View className="justify-center pr-3">
          <View className={`w-12 h-12 ${playBg} rounded-full items-center justify-center`}>
            <Ionicons name="play" size={20} color={playIcon} style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>

      {/* Clear button */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 items-center justify-center"
      >
        <Ionicons name="close" size={16} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

export default function ContinueScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;
  const { getInProgressStories, clearProgress, clearAllProgress } = usePlaybackProgress();

  // Get in-progress stories with their story data
  const inProgressStories = getInProgressStories();
  const storiesWithData = inProgressStories
    .map((progress) => {
      const story = getStoryById(progress.storyId);
      return story ? { story, progress } : null;
    })
    .filter((item): item is { story: Story; progress: PlaybackProgress } => item !== null);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  // Handle story press - navigate with voiceId if available
  const handleStoryPress = (storyId: string, voiceId?: string) => {
    router.push({
      pathname: '/story/[id]',
      params: { id: storyId, ...(voiceId ? { voiceId } : {}) },
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
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => router.back()}
              className={`w-11 h-11 rounded-full items-center justify-center ${cardBg} border-b-[3px] ${borderColor}`}
            >
              <Ionicons name="arrow-back" size={20} color={isNightMode ? '#f8f9fa' : '#3d3630'} />
            </Pressable>
            
            {storiesWithData.length > 0 && (
              <Pressable
                onPress={clearAllProgress}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Text
                  style={{ color: accentColor, fontFamily: 'Nunito_700Bold', fontSize: 12 }}
                >
                  Clear All
                </Text>
              </Pressable>
            )}
          </View>
          
          <Text
            className={`${primaryText} text-2xl`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            Continue Listening
          </Text>
          <Text
            className={`${secondaryText} text-sm mt-2`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Pick up where you left off
          </Text>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className={`${cardBg} rounded-2xl p-4 border-b-[3px] ${borderColor} flex-row items-center`}>
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${accentColor}30` }}
            >
              <Ionicons name="time" size={24} color={accentColor} />
            </View>
            <View className="ml-4 flex-1">
              <Text
                className={`${primaryText} text-lg`}
                style={{ fontFamily: 'Nunito_800ExtraBold' }}
              >
                {storiesWithData.length} {storiesWithData.length === 1 ? 'Story' : 'Stories'} In Progress
              </Text>
              <Text
                className={`${secondaryText} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                Tap to continue from where you paused
              </Text>
            </View>
          </View>
        </View>

        {/* In Progress List */}
        <View className="px-6">
          {storiesWithData.map(({ story, progress }) => (
            <ContinueStoryCard
              key={story.id}
              story={story}
              progress={progress}
              isNightMode={isNightMode}
              onPress={() => handleStoryPress(story.id, progress.voiceId)}
              onClear={() => clearProgress(story.id)}
            />
          ))}
        </View>

        {/* Empty State */}
        {storiesWithData.length === 0 && (
          <View className="px-6 py-12 items-center">
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={isNightMode ? '#7b8fb8' : '#8a7f75'}
            />
            <Text
              className={`${primaryText} text-xl text-center mt-4`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              All caught up!
            </Text>
            <Text
              className={`${secondaryText} text-sm text-center mt-2 px-8`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              You don't have any stories in progress. Start listening to a story and come back here to continue later!
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/browse')}
              className="mt-6 px-6 py-3 rounded-full"
              style={{ backgroundColor: accentColor }}
            >
              <Text
                className="text-white text-sm"
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Browse Stories
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

