import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { getStoryById, Story } from '@/constants/stories';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Favorite Story Card Component
function FavoriteStoryCard({ 
  story, 
  isNightMode,
  onPress,
  onRemove,
}: { 
  story: Story; 
  isNightMode: boolean;
  onPress: () => void;
  onRemove: () => void;
}) {
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const titleColor = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const subtitleColor = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const playBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const playIcon = isNightMode ? '#1e2749' : '#ffffff';
  const iconColor = isNightMode ? '#c4cfdb' : '#8a7f75';
  const heartColor = isNightMode ? '#ffd166' : '#ff8c42';

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
      {/* Cover Image */}
      <Image source={story.coverImage} className="w-full h-44" resizeMode="cover" />
      
      {/* Heart button overlay */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
      >
        <Ionicons name="heart" size={22} color={heartColor} />
      </Pressable>
      
      {/* Content */}
      <View className="p-4">
        <Text
          className={`${titleColor} text-xl mb-1`}
          style={{ fontFamily: 'Nunito_800ExtraBold' }}
          numberOfLines={1}
        >
          {story.title}
        </Text>
        
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
              <Ionicons name="albums-outline" size={14} color={iconColor} />
              <Text
                className={`${subtitleColor} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                {story.category}
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

export default function FavoritesScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;
  const { favorites, removeFavorite } = useFavorites();

  // Get full story objects for favorited story IDs
  const favoriteStories = favorites
    .map((id) => getStoryById(id))
    .filter((story): story is Story => story !== undefined);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const accentColor = isNightMode ? '#ffd166' : '#ff8c42';

  // Handle story press
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
            Favorites
          </Text>
          <Text
            className={`${secondaryText} text-sm mt-2`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Stories you've loved and saved for later
          </Text>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className={`${cardBg} rounded-2xl p-4 border-b-[3px] ${borderColor} flex-row items-center`}>
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${accentColor}30` }}
            >
              <Ionicons name="heart" size={24} color={accentColor} />
            </View>
            <View className="ml-4 flex-1">
              <Text
                className={`${primaryText} text-lg`}
                style={{ fontFamily: 'Nunito_800ExtraBold' }}
              >
                {favoriteStories.length} {favoriteStories.length === 1 ? 'Story' : 'Stories'} Saved
              </Text>
              <Text
                className={`${secondaryText} text-xs`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                Tap the heart to remove from favorites
              </Text>
            </View>
          </View>
        </View>

        {/* Favorites List */}
        <View className="px-6">
          {favoriteStories.map((story) => (
            <FavoriteStoryCard
              key={story.id}
              story={story}
              isNightMode={isNightMode}
              onPress={() => handleStoryPress(story)}
              onRemove={() => removeFavorite(story.id)}
            />
          ))}
        </View>

        {/* Empty State */}
        {favoriteStories.length === 0 && (
          <View className="px-6 py-12 items-center">
            <Ionicons
              name="heart-outline"
              size={64}
              color={isNightMode ? '#7b8fb8' : '#8a7f75'}
            />
            <Text
              className={`${primaryText} text-xl text-center mt-4`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              No favorites yet
            </Text>
            <Text
              className={`${secondaryText} text-sm text-center mt-2 px-8`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Tap the heart icon on any story to add it to your favorites!
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

