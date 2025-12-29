import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { SavedVoice, useSavedVoices } from '@/contexts/SavedVoicesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cloneVoice, isApiKeyConfigured } from '@/services/VoiceCloningService';

// Sample script for recording
const sampleScript = {
  title: 'The Sleepy Forest',
  content: `Once upon a time, in a cozy forest filled with tall trees and soft moss, there lived a little bunny named Bella. Every night, as the sun painted the sky orange and pink, Bella would hop to her favorite spot by the old oak tree.`,
};

export default function RecordScreen() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;
  
  // Use shared saved voices context
  const { savedVoices, addVoice } = useSavedVoices();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [tempRecordingUri, setTempRecordingUri] = useState<string | null>(null);
  const [tempRecordingDuration, setTempRecordingDuration] = useState(0);
  const [voiceName, setVoiceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Pulse animation for recording button
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const recordBtnBg = isNightMode ? '#ffd166' : '#ff8c42';
  const recordBtnShadow = isNightMode ? '#ffd166' : '#ff8c42';
  const iconColor = isNightMode ? '#1e2749' : '#ffffff';

  // Request microphone permission on mount
  useEffect(() => {
    async function requestPermission() {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert(
            'Microphone Permission Required',
            'Please enable microphone access in your device settings to record your voice.',
            [{ text: 'OK' }]
          );
        }
        
        // Configure audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error('Error requesting permission:', error);
        setHasPermission(false);
      }
    }
    requestPermission();

    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Start/stop pulse animation based on recording state
  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      pulseScale.value = withTiming(1, { duration: 200 });
      pulseOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording, pulseScale, pulseOpacity]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone access is required to record.');
      return;
    }

    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  };

  // Minimum recording time for voice cloning (30 seconds)
  const MIN_RECORDING_SECONDS = 30;

  const handleStopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // Check minimum recording time for voice cloning quality
      if (recordingDuration < MIN_RECORDING_SECONDS) {
        Alert.alert(
          'Recording Too Short',
          `For best voice cloning results, please record at least ${MIN_RECORDING_SECONDS} seconds of audio.\n\nYou recorded ${recordingDuration} seconds.\n\nLonger recordings (1-3 minutes) produce better voice quality.`,
          [
            { 
              text: 'Try Again', 
              style: 'cancel',
              onPress: () => {
                // Reset recording duration for next attempt
                setRecordingDuration(0);
              }
            },
            { 
              text: 'Save Anyway', 
              onPress: () => {
                // Store temp recording info and show modal
                setTempRecordingUri(uri);
                setTempRecordingDuration(recordingDuration);
                setVoiceName('');
                setModalVisible(true);
              }
            }
          ]
        );
        return;
      }

      // Store temp recording info and show modal
      setTempRecordingUri(uri);
      setTempRecordingDuration(recordingDuration);
      setVoiceName('');
      setModalVisible(true);

      console.log('Recording ready at:', uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  // Handle save from modal - now calls ElevenLabs API
  const handleSaveVoice = async () => {
    if (!tempRecordingUri || voiceName.trim() === '') return;

    // Check if API key is configured
    if (!isApiKeyConfigured()) {
      Alert.alert(
        'API Key Required',
        'Please configure your ElevenLabs API key in services/VoiceCloningService.ts',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSaving(true);

    try {
      // Call ElevenLabs API to clone the voice
      const response = await cloneVoice(tempRecordingUri, voiceName.trim());

      // Success - add to saved voices list with the returned voice_id
      const newVoice: SavedVoice = {
        id: Date.now().toString(),
        name: voiceName.trim(),
        duration: formatDuration(tempRecordingDuration),
        date: new Date().toLocaleDateString(),
        uri: tempRecordingUri,
        voiceId: response.voice_id,
      };
      await addVoice(newVoice);

      // Reset and close modal
      setTempRecordingUri(null);
      setTempRecordingDuration(0);
      setVoiceName('');
      setModalVisible(false);

      // Show success message
      Alert.alert(
        'Voice Saved!',
        `"${voiceName.trim()}" has been cloned successfully.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Voice Cloning Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard from modal
  const handleDiscardVoice = () => {
    setTempRecordingUri(null);
    setTempRecordingDuration(0);
    setVoiceName('');
    setModalVisible(false);
  };

  const handleRecordPress = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  // Play/pause a saved voice recording
  const handlePlayVoice = async (voice: SavedVoice) => {
    try {
      // If already playing this voice, stop it
      if (playingVoiceId === voice.id) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPlayingVoiceId(null);
        return;
      }

      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Set audio mode for playback - use speaker for louder output
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false, // Use speaker on Android
      });

      // Load and play the audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: voice.uri },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setPlayingVoiceId(voice.id);

      // Listen for playback status to know when it finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingVoiceId(null);
          sound.unloadAsync();
          soundRef.current = null;
          // Reset audio mode for recording
          Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: false,
          });
        }
      });
    } catch (error) {
      console.error('Error playing voice:', error);
      setPlayingVoiceId(null);
      Alert.alert('Playback Error', 'Could not play the recording.');
    }
  };

  return (
    <View className={`flex-1 ${bg}`}>
      <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Title Section */}
          <View className="px-6 mt-4">
            <Text
              className={`${primaryText} text-2xl text-center`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              Record Your Voice
            </Text>
            <Text
              className={`${secondaryText} text-base text-center mt-2`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Read the script aloud, then tap to record
            </Text>
          </View>

          {/* Script Card - Now above the recording button */}
          <View className="px-6 mt-6">
            <View
              className={`${cardBg} rounded-3xl p-5 border-b-4 ${borderColor}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Text
                className={`${secondaryText} text-xs uppercase tracking-wider mb-2`}
                style={{ fontFamily: 'Nunito_700Bold' }}
              >
                Read this aloud
              </Text>
              <Text
                className={`${primaryText} text-base leading-7 italic`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                "{sampleScript.content}"
              </Text>
            </View>
          </View>

          {/* Recording Button - Now below the script */}
          <View className="items-center mt-8">
            <Animated.View style={animatedPulseStyle}>
              <Pressable
                onPress={handleRecordPress}
                disabled={hasPermission === false}
                className="w-32 h-32 rounded-full items-center justify-center"
                style={{
                  backgroundColor: recordBtnBg,
                  shadowColor: recordBtnShadow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 12,
                  opacity: hasPermission === false ? 0.5 : 1,
                }}
              >
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={48}
                  color={iconColor}
                />
              </Pressable>
            </Animated.View>

            {/* Recording status */}
            <View className="mt-6 items-center">
              {isRecording ? (
                <>
                  <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <Text
                      className={`${accentColor} text-lg`}
                      style={{ fontFamily: 'Nunito_700Bold' }}
                    >
                      Recording...
                    </Text>
                  </View>
                  <Text
                    className={`${primaryText} text-3xl mt-2`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    {formatDuration(recordingDuration)}
                  </Text>
                  
                  {/* Progress toward minimum time */}
                  <View className="mt-4 w-48">
                    <View 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: isNightMode ? '#2b3a67' : '#e3d9cf' }}
                    >
                      <View 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.min(100, (recordingDuration / MIN_RECORDING_SECONDS) * 100)}%`,
                          backgroundColor: recordingDuration >= MIN_RECORDING_SECONDS 
                            ? '#22c55e' // green when minimum reached
                            : (isNightMode ? '#ffd166' : '#ff8c42'),
                        }}
                      />
                    </View>
                    <Text
                      className={`${secondaryText} text-xs text-center mt-2`}
                      style={{ fontFamily: 'Nunito_400Regular' }}
                    >
                      {recordingDuration >= MIN_RECORDING_SECONDS 
                        ? '✓ Minimum reached! Keep going for better quality.'
                        : `${MIN_RECORDING_SECONDS - recordingDuration}s more for best results`
                      }
                    </Text>
                  </View>
                </>
              ) : (
                <View className="items-center">
                  <Text
                    className={`${secondaryText} text-base`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Tap to start recording
                  </Text>
                  <Text
                    className={`${secondaryText} text-xs mt-1`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Record at least 30 seconds for best voice quality
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Saved Voices Section */}
          <View className="px-6 mt-10">
            <Text
              className={`${primaryText} text-lg mb-3`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              Saved Voices ({savedVoices.length})
            </Text>

            {savedVoices.length === 0 ? (
              <View
                className={`${cardBg} rounded-2xl p-6 border-b-4 ${borderColor} items-center`}
              >
                <Ionicons
                  name="mic-off-outline"
                  size={32}
                  color={isNightMode ? '#7b8fb8' : '#8a7f75'}
                />
                <Text
                  className={`${secondaryText} text-base mt-3 text-center`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  No recordings yet.{'\n'}Tap the button above to record!
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {savedVoices.map((voice) => {
                  const isPlaying = playingVoiceId === voice.id;
                  return (
                    <View
                      key={voice.id}
                      className={`flex-row items-center ${cardBg} rounded-2xl p-4 border-b-4 ${borderColor}`}
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 2,
                      }}
                    >
                      {/* Play/Pause Button */}
                      <Pressable
                        onPress={() => handlePlayVoice(voice)}
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{
                          backgroundColor: isPlaying
                            ? (isNightMode ? '#ffd166' : '#ff8c42')
                            : (isNightMode ? '#2b3a67' : '#e3d9cf'),
                        }}
                      >
                        <Ionicons
                          name={isPlaying ? 'pause' : 'play'}
                          size={20}
                          color={isPlaying
                            ? (isNightMode ? '#1e2749' : '#ffffff')
                            : (isNightMode ? '#ffd166' : '#ff8c42')}
                        />
                      </Pressable>
                      <View className="flex-1">
                        <Text
                          className={`${primaryText} text-base`}
                          style={{ fontFamily: 'Nunito_700Bold' }}
                        >
                          {voice.name}
                        </Text>
                        <Text
                          className={`${secondaryText} text-sm`}
                          style={{ fontFamily: 'Nunito_400Regular' }}
                        >
                          {voice.duration} • {voice.date}
                        </Text>
                      </View>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={isNightMode ? '#c4cfdb' : '#8a7f75'}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

      {/* Save Voice Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDiscardVoice}
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View
            className={`${isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]'} rounded-3xl p-6 w-[345px]`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.1,
              shadowRadius: 25,
              elevation: 10,
            }}
          >
            {/* Title */}
            <Text
              className={`${primaryText} text-xl text-center`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              Name this voice
            </Text>

            {/* Subtitle */}
            <Text
              className={`${secondaryText} text-sm text-center mt-2`}
              style={{ fontFamily: 'Nunito_400Regular' }}
            >
              Who is speaking? (e.g. Mom or Dad)
            </Text>

            {/* Input */}
            <View
              className={`mt-6 rounded-2xl overflow-hidden ${isNightMode ? 'bg-pawpaw-navy border-pawpaw-border' : 'bg-[#f5ede6] border-[#e3d9cf]'} border`}
              style={{
                shadowColor: isNightMode ? '#ffd166' : '#b88a7b',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.48,
                shadowRadius: 2.85,
                elevation: 2,
              }}
            >
              <TextInput
                value={voiceName}
                onChangeText={setVoiceName}
                placeholder="e.g. Mom"
                placeholderTextColor={isNightMode ? '#7b8fb8' : '#8a7f75'}
                className={`h-12 px-4 text-lg ${isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]'}`}
                style={{ fontFamily: 'Nunito_400Regular' }}
                autoFocus
              />
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mt-6">
              {/* Discard Button */}
              <Pressable
                onPress={handleDiscardVoice}
                disabled={isSaving}
                className={`flex-1 h-12 rounded-2xl items-center justify-center ${isNightMode ? 'bg-pawpaw-navy border-pawpaw-border' : 'bg-[#f5ede6] border-[#e3d9cf]'} border`}
                style={{ opacity: isSaving ? 0.5 : 1 }}
              >
                <Text
                  className={`${secondaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Discard
                </Text>
              </Pressable>

              {/* Save Button */}
              <Pressable
                onPress={handleSaveVoice}
                disabled={voiceName.trim() === '' || isSaving}
                className="flex-1 h-12 rounded-2xl items-center justify-center"
                style={{
                  backgroundColor: isNightMode ? '#ffd166' : '#ff8c42',
                  borderBottomWidth: 4,
                  borderBottomColor: isNightMode ? '#e6b84d' : '#e67700',
                  opacity: voiceName.trim() === '' || isSaving ? 0.5 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                {isSaving ? (
                  <ActivityIndicator 
                    size="small" 
                    color={isNightMode ? '#1e2749' : '#ffffff'} 
                  />
                ) : (
                  <Text
                    className={`text-sm ${isNightMode ? 'text-pawpaw-navy' : 'text-white'}`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Save
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

