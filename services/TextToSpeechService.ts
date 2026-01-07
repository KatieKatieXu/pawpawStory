/**
 * ElevenLabs Text-to-Speech Service
 * 
 * This service generates audio from text using cloned voices.
 * It uses the ElevenLabs TTS API to convert story text to speech.
 */

// Import from legacy which maintains backward compatibility
import * as FileSystem from 'expo-file-system/legacy';

// API Configuration
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// ElevenLabs API Key from environment variable
const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';

// ElevenLabs has a character limit per request (around 5000 for most plans)
const MAX_TEXT_LENGTH = 5000;

export interface TTSOptions {
  voiceId: string;
  text: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface TTSResponse {
  audioUri: string; // Local file URI of the generated audio
}

/**
 * Generate speech from text using a cloned voice
 * 
 * @param options - TTS options including voiceId and text
 * @returns Promise with the local audio file URI
 * @throws Error with message on failure
 */
export async function generateSpeech(options: TTSOptions): Promise<TTSResponse> {
  const {
    voiceId,
    text,
    modelId = 'eleven_multilingual_v2', // Better model for cloned voices
    stability = 0.5,
    similarityBoost = 0.75,
  } = options;

  console.log('[TTS] Starting speech generation...');
  console.log('[TTS] Voice ID:', voiceId);
  console.log('[TTS] Text length:', text.length, 'characters');
  console.log('[TTS] Model:', modelId);

  // Truncate text if too long
  let processedText = text;
  if (text.length > MAX_TEXT_LENGTH) {
    console.log('[TTS] Text too long, truncating to', MAX_TEXT_LENGTH, 'characters');
    processedText = text.substring(0, MAX_TEXT_LENGTH);
  }

  try {
    const apiUrl = `${ELEVENLABS_TTS_URL}/${voiceId}`;
    console.log('[TTS] API URL:', apiUrl);

    // Make the API request to generate audio
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: processedText,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    });

    console.log('[TTS] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] Error response body:', errorText);
      
      let errorMessage = `TTS failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        console.error('[TTS] Error data:', JSON.stringify(errorData));
        errorMessage = errorData.detail?.message || errorData.detail?.status || errorData.message || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText.substring(0, 200);
        }
      }
      
      throw new Error(errorMessage);
    }

    // Get the audio data as a blob
    const audioBlob = await response.blob();
    console.log('[TTS] Audio blob size:', audioBlob.size, 'bytes');

    if (audioBlob.size === 0) {
      throw new Error('Received empty audio response from API');
    }

    // Convert blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/mpeg;base64,")
        const base64Data = base64.split(',')[1];
        if (!base64Data) {
          reject(new Error('Failed to convert audio to base64'));
          return;
        }
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(audioBlob);
    });

    // Generate a unique filename
    const filename = `tts_${voiceId}_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    console.log('[TTS] Saving to:', fileUri);

    // Write the audio file
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[TTS] Audio saved successfully!');

    return {
      audioUri: fileUri,
    };

  } catch (error) {
    console.error('[TTS] Error caught:', error);
    console.error('[TTS] Error name:', error instanceof Error ? error.name : 'unknown');
    console.error('[TTS] Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof TypeError && error.message.includes('Network')) {
      throw new Error('Network error - check your internet connection');
    }

    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    
    throw new Error('Unknown error occurred during speech generation');
  }
}

/**
 * Generate speech for a story using a specific voice
 * This is a convenience wrapper for generating full story audio
 * 
 * @param storyId - The story ID
 * @param storyText - The full text of the story
 * @param voiceId - The cloned voice ID to use
 * @returns Promise with the audio file URI
 */
export async function generateStoryAudio(
  storyId: string,
  storyText: string,
  voiceId: string
): Promise<string> {
  console.log('[TTS] Generating audio for story:', storyId);
  console.log('[TTS] Story text length:', storyText.length);
  console.log('[TTS] Voice ID:', voiceId);
  
  // Check if we already have a cached version
  const cacheFilename = `story_${storyId}_${voiceId}.mp3`;
  const cacheUri = `${FileSystem.cacheDirectory}${cacheFilename}`;
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(cacheUri);
    if (fileInfo.exists) {
      console.log('[TTS] Using cached audio:', cacheUri);
      return cacheUri;
    }
  } catch (error) {
    // File doesn't exist, continue to generate
    console.log('[TTS] Cache check error (likely file not found):', error);
  }
  
  console.log('[TTS] No cache found, generating new audio...');
  
  // Generate new audio
  const result = await generateSpeech({
    voiceId,
    text: storyText,
  });
  
  // Move to cache filename for future use
  try {
    await FileSystem.moveAsync({
      from: result.audioUri,
      to: cacheUri,
    });
    console.log('[TTS] Audio cached at:', cacheUri);
    return cacheUri;
  } catch (error) {
    // If move fails, just return the original URI
    console.log('[TTS] Move failed, using original URI:', error);
    return result.audioUri;
  }
}

/**
 * Clear cached audio for a specific story or all stories
 * 
 * @param storyId - Optional story ID to clear, or undefined to clear all
 */
export async function clearAudioCache(storyId?: string): Promise<void> {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) return;

  try {
    const files = await FileSystem.readDirectoryAsync(cacheDir);
    
    for (const file of files) {
      if (file.startsWith('story_') || file.startsWith('tts_')) {
        if (!storyId || file.includes(storyId)) {
          await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
          console.log('[TTS] Deleted cached file:', file);
        }
      }
    }
  } catch (error) {
    console.error('[TTS] Error clearing cache:', error);
  }
}

/**
 * Check if audio is cached for a story/voice combination
 */
export async function isAudioCached(storyId: string, voiceId: string): Promise<boolean> {
  const cacheFilename = `story_${storyId}_${voiceId}.mp3`;
  const cacheUri = `${FileSystem.cacheDirectory}${cacheFilename}`;
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(cacheUri);
    return fileInfo.exists;
  } catch {
    return false;
  }
}
