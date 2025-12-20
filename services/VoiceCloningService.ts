/**
 * ElevenLabs Voice Cloning Service
 * 
 * This service handles voice cloning via the ElevenLabs API.
 * It uploads audio recordings and creates custom voice profiles.
 */

// API Configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/voices/add';

// ElevenLabs API Key
// Note: In production, use environment variables or secure storage
const API_KEY = 'sk_f01cc10ebae3b08ec0b0a06697b04b39c6d73585b900ffc7';

export interface CloneVoiceResponse {
  voice_id: string;
}

export interface CloneVoiceError {
  message: string;
  status?: number;
}

/**
 * Clone a voice using the ElevenLabs API
 * 
 * @param audioUri - Local file URI of the recorded audio
 * @param name - Name for the cloned voice (e.g., "Mom", "Dad")
 * @returns Promise with the voice_id on success
 * @throws Error with message on failure
 */
export async function cloneVoice(
  audioUri: string,
  name: string
): Promise<CloneVoiceResponse> {
  console.log('[VoiceCloning] Starting voice clone...');
  console.log('[VoiceCloning] Audio URI:', audioUri);
  console.log('[VoiceCloning] Voice name:', name);

  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Append the voice name
    formData.append('name', name);
    
    // Append the audio file
    // React Native requires this specific format for file uploads
    const fileExtension = audioUri.split('.').pop()?.split('?')[0] || 'caf';
    
    // iOS recordings are typically in CAF format, but can also be m4a
    // ElevenLabs accepts: mp3, mp4, m4a, wav, webm, ogg
    const mimeType = fileExtension === 'wav' ? 'audio/wav' : 
                     fileExtension === 'mp3' ? 'audio/mpeg' :
                     fileExtension === 'caf' ? 'audio/x-caf' :
                     fileExtension === 'm4a' ? 'audio/mp4' :
                     'audio/mp4'; // Default to mp4 for iOS compatibility
    
    console.log('[VoiceCloning] File extension:', fileExtension);
    console.log('[VoiceCloning] MIME type:', mimeType);

    // For React Native, we need to format the file object correctly
    const fileObject = {
      uri: audioUri,
      type: mimeType,
      name: `recording.${fileExtension}`,
    };
    
    console.log('[VoiceCloning] File object:', JSON.stringify(fileObject));
    
    formData.append('files', fileObject as unknown as Blob);
    
    // Optional: Add description for the voice
    formData.append('description', `Voice profile for ${name} created via PawpawStory app`);
    
    console.log('[VoiceCloning] Sending request to ElevenLabs...');
    
    // Make the API request
    const response = await fetch(ELEVENLABS_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        // Note: Don't set Content-Type manually for FormData
        // fetch will automatically set the correct multipart boundary
      },
      body: formData,
    });
    
    console.log('[VoiceCloning] Response status:', response.status);
    
    // Get response text first for debugging
    const responseText = await response.text();
    console.log('[VoiceCloning] Response body:', responseText);
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail?.message || 
                      errorData.detail?.status || 
                      errorData.message || 
                      errorMessage;
      } catch {
        // If response isn't JSON, use the text as error
        if (responseText) {
          errorMessage = responseText.substring(0, 200);
        }
      }
      
      console.error('[VoiceCloning] Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    const data = JSON.parse(responseText);
    
    if (!data.voice_id) {
      console.error('[VoiceCloning] Invalid response - no voice_id');
      throw new Error('Invalid response: missing voice_id');
    }
    
    console.log('[VoiceCloning] Success! Voice ID:', data.voice_id);
    
    return {
      voice_id: data.voice_id,
    };
    
  } catch (error) {
    console.error('[VoiceCloning] Error caught:', error);
    
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('Network')) {
      throw new Error('Network error - check your internet connection');
    }
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * Validate that an API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return API_KEY !== 'YOUR_ELEVENLABS_API_KEY' && API_KEY.length > 0;
}

/**
 * Set the API key (useful for runtime configuration)
 * Note: In production, use secure storage or environment variables
 */
let runtimeApiKey: string | null = null;

export function setApiKey(key: string): void {
  runtimeApiKey = key;
}

export function getApiKey(): string {
  return runtimeApiKey || API_KEY;
}

