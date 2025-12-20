import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStoryById } from '@/constants/stories';
import { useSavedVoices } from '@/contexts/SavedVoicesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { generateStoryAudio } from '@/services/TextToSpeechService';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getGoogleDriveDownloadUrl(url: string): string {
  // Convert Google Drive share links to direct download URLs
  if (!url) return '';
  const match = url.match(/\/file\/d\/([^/]+)/);
  const idFromPath = match?.[1];
  const idFromQuery = (() => {
    try {
      const u = new URL(url);
      return u.searchParams.get('id') ?? undefined;
    } catch {
      return undefined;
    }
  })();
  const id = idFromPath || idFromQuery;
  if (!id) return url;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

function StoryNotFound() {
  return (
    <View className="flex-1 bg-pawpaw-navy">
      <SafeAreaView className="flex-1 px-6 items-center justify-center">
        <Ionicons name="book-outline" size={48} color="#c4cfdb" />
        <Text className="text-pawpaw-white text-2xl mt-4" style={{ fontFamily: 'Nunito_800ExtraBold' }}>
          Story not found
        </Text>
        <Text className="text-pawpaw-gray text-base mt-2 text-center" style={{ fontFamily: 'Nunito_400Regular' }}>
          The story you're looking for doesn't exist.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-8 bg-pawpaw-yellow px-8 py-4 rounded-2xl border-b-4 border-pawpaw-yellowDark"
        >
          <Text className="text-pawpaw-navy text-base" style={{ fontFamily: 'Nunito_700Bold' }}>
            Go back
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

export default function StoryDetailScreen() {
  const { id, voiceId } = useLocalSearchParams<{ id: string; voiceId?: string }>();
  const { isDayMode } = useTheme();
  const { savedVoices } = useSavedVoices();

  const storyId = useMemo(() => (typeof id === 'string' ? id : ''), [id]);
  const story = getStoryById(storyId);

  // Find the selected voice from saved voices
  const selectedVoice = useMemo(() => {
    if (!voiceId) return null;
    return savedVoices.find((v) => v.voiceId === voiceId || v.id === voiceId) || null;
  }, [voiceId, savedVoices]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);

  // Audio state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUri, setGeneratedAudioUri] = useState<string | null>(null);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  // Animated progress bar
  const progressWidth = useSharedValue(0);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Calculate progress percentage
  const progress01 = durationMs > 0 ? positionMs / durationMs : 0;

  // Update animated progress bar
  useEffect(() => {
    progressWidth.value = withTiming(progress01 * 100, { duration: 100 });
  }, [progress01, progressWidth]);

  // Audio playback status callback
  const onPlaybackStatusUpdate = useCallback((status: { isLoaded: boolean; positionMillis?: number; durationMillis?: number; isPlaying?: boolean; didJustFinish?: boolean }) => {
    if (!status.isLoaded) return;

    setPositionMs(status.positionMillis ?? 0);
    setDurationMs(status.durationMillis ?? 0);
    setIsPlaying(status.isPlaying ?? false);

    // Handle playback finished
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMs(0);
      progressWidth.value = withTiming(0, { duration: 300 });
    }
  }, [progressWidth]);

  // Load audio when component mounts or when generated audio is available
  useEffect(() => {
    let isMounted = true;

    async function loadAudio() {
      // Prioritize generated TTS audio when a voice is selected
      const audioSource = generatedAudioUri 
        ? generatedAudioUri 
        : story?.audioUrl 
          ? getGoogleDriveDownloadUrl(story.audioUrl) 
          : null;
      
      if (!audioSource) return;

      try {
        // Configure audio mode - use speaker for louder playback
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false, // Use speaker
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioSource },
          { shouldPlay: false, rate: speed, progressUpdateIntervalMillis: 100 },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    }

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [story?.audioUrl, generatedAudioUri, onPlaybackStatusUpdate, speed]);

  // Update playback rate when speed changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setRateAsync(speed, true);
    }
  }, [speed]);

  const handlePlayPause = async () => {
    // If we have a selected voice but no generated audio yet, generate it
    if (selectedVoice?.voiceId && !generatedAudioUri && story?.textContent) {
      setIsGenerating(true);
      try {
        const audioUri = await generateStoryAudio(
          story.id,
          story.textContent,
          selectedVoice.voiceId
        );
        setGeneratedAudioUri(audioUri);
        
        // Configure audio mode - use speaker
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });
        
        // Load and play the new audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, rate: speed, progressUpdateIntervalMillis: 100 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to generate audio:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert(
          'Voice Generation Failed', 
          `Could not generate audio: ${errorMsg}\n\nPlease check:\n• Internet connection\n• Voice was cloned successfully\n• Try again in a moment`,
          [
            { text: 'OK' },
            { text: 'Go Back', onPress: () => router.back() }
          ]
        );
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (!soundRef.current) {
      // Determine the audio source
      const audioSource = generatedAudioUri 
        ? generatedAudioUri 
        : story?.audioUrl 
          ? getGoogleDriveDownloadUrl(story.audioUrl) 
          : null;
      
      if (!audioSource) {
        // No audio available - give helpful message
        if (selectedVoice) {
          Alert.alert('No Story Text', 'This story does not have text content for voice generation.');
        } else {
          Alert.alert(
            'No Voice Selected', 
            'Please go back and select a voice to read this story.',
            [
              { text: 'Go Back', onPress: () => router.back() }
            ]
          );
        }
        return;
      }
      
      setIsLoading(true);
      try {
        // Configure audio mode - use speaker
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });
        
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioSource },
          { shouldPlay: true, rate: speed, progressUpdateIntervalMillis: 100 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio:', error);
        Alert.alert('Error', 'Could not load audio. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Could not play audio. Please try again.');
    }
  };

  const handleSeek = async (event: { nativeEvent: { locationX: number; } }, containerWidth: number) => {
    if (!soundRef.current || durationMs === 0) return;

    const seekPosition = (event.nativeEvent.locationX / containerWidth) * durationMs;
    await soundRef.current.setPositionAsync(Math.max(0, Math.min(seekPosition, durationMs)));
  };

  const handleToggleSpeed = () => {
    setSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1));
  };

  if (!story) return <StoryNotFound />;

  // Use global theme - isDayMode comes from ThemeContext
  const isNightMode = !isDayMode;
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const card = isNightMode ? 'bg-pawpaw-navyLight/60' : 'bg-[#fdfbf8]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const toggleBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';

  const currentTimeLabel = formatTime(positionMs);
  const totalTimeLabel = durationMs > 0 ? formatTime(durationMs) : story.duration;

  return (
    <View className={`flex-1 ${bg}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <View className="flex-row items-center px-6 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className={`w-11 h-11 rounded-full items-center justify-center ${card} border-b-[3px] ${toggleBorder}`}
          >
            <Ionicons name="arrow-back" size={20} color={isNightMode ? '#f8f9fa' : '#3d3630'} />
          </Pressable>
        </View>

        {/* Hero Image - Square & Centered */}
        <View className="px-6 items-center">
          <View className={`w-56 h-56 rounded-3xl overflow-hidden ${card}`}>
            <Image source={story.coverImage} className="w-full h-full" resizeMode="cover" />
          </View>
        </View>

        {/* Title + Short Description - Centered */}
        <View className="px-6 mt-6 items-center">
          <Text className={`${primaryText} text-[28px] text-center`} style={{ fontFamily: 'Nunito_800ExtraBold' }}>
            {story.title}
          </Text>
          <Text className={`${secondaryText} text-base mt-2 leading-6 text-center`} style={{ fontFamily: 'Nunito_400Regular' }}>
            {story.description}
          </Text>
          <Text className={`${secondaryText} text-sm mt-3 text-center`} style={{ fontFamily: 'Nunito_700Bold' }}>
            Narrated by {selectedVoice ? selectedVoice.name : story.narrator}
          </Text>
          {selectedVoice && (
            <View 
              className="mt-2 px-3 py-1 rounded-full"
              style={{ backgroundColor: isNightMode ? 'rgba(255,209,102,0.2)' : 'rgba(255,140,66,0.2)' }}
            >
              <Text 
                className={isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]'} 
                style={{ fontFamily: 'Nunito_700Bold', fontSize: 12 }}
              >
                ✨ Custom Voice
              </Text>
            </View>
          )}
        </View>

        {/* Player Controls */}
        <View className="px-6 mt-6">
          <View className={`rounded-3xl p-5 ${card} border-b-[4px] ${toggleBorder}`}>
            {/* Progress Bar - Tappable for seeking */}
            <Pressable
              onPress={(e) => handleSeek(e, 280)} // Approximate width, adjust as needed
              className="active:opacity-90"
            >
              <View className={`h-3 rounded-full overflow-hidden ${isNightMode ? 'bg-pawpaw-navyLight/80' : 'bg-[#e3d9cf]'}`}>
                <Animated.View
                  className={`h-full rounded-full ${isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]'}`}
                  style={animatedProgressStyle}
                />
              </View>
              <View className="flex-row justify-between mt-3">
                <Text className={`${secondaryText} text-xs`} style={{ fontFamily: 'Nunito_400Regular' }}>
                  {currentTimeLabel}
                </Text>
                <Text className={`${secondaryText} text-xs`} style={{ fontFamily: 'Nunito_400Regular' }}>
                  {totalTimeLabel}
                </Text>
              </View>
            </Pressable>

            {/* Buttons row: Favorite / Play / Speed */}
            <View className="flex-row items-center justify-between mt-6">
              <Pressable
                onPress={() => setIsFavorite((v) => !v)}
                className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  isNightMode ? 'bg-pawpaw-navyLight/80' : 'bg-[#e3d9cf]'
                }`}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? (isNightMode ? '#ffd166' : '#ff8c42') : (isNightMode ? '#c4cfdb' : '#8a7f75')}
                />
                <Text className={`${secondaryText} text-[10px] mt-1`} style={{ fontFamily: 'Nunito_400Regular' }}>
                  Fav
                </Text>
              </Pressable>

              <View className="items-center">
                <Pressable
                  onPress={handlePlayPause}
                  disabled={isLoading || isGenerating}
                  className={`w-20 h-20 rounded-full items-center justify-center ${isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]'}`}
                  style={{
                    shadowColor: isNightMode ? '#ffd166' : '#ff8c42',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 14,
                    elevation: 10,
                    opacity: (isLoading || isGenerating) ? 0.7 : 1,
                  }}
                >
                  <Ionicons
                    name={(isLoading || isGenerating) ? 'hourglass' : isPlaying ? 'pause' : 'play'}
                    size={36}
                    color={isNightMode ? '#1e2749' : '#ffffff'}
                    style={{ marginLeft: (isPlaying || isLoading || isGenerating) ? 0 : 4 }}
                  />
                </Pressable>
                {isGenerating && (
                  <Text className={`${secondaryText} text-xs mt-2`} style={{ fontFamily: 'Nunito_400Regular' }}>
                    Generating audio...
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleToggleSpeed}
                className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  isNightMode ? 'bg-pawpaw-navyLight/80' : 'bg-[#e3d9cf]'
                }`}
              >
                <Ionicons name="speedometer-outline" size={22} color={isNightMode ? '#c4cfdb' : '#8a7f75'} />
                <Text className={`${secondaryText} text-[10px] mt-1`} style={{ fontFamily: 'Nunito_400Regular' }}>
                  {speed}x
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
