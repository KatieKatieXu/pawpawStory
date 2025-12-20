/**
 * OpenAI Service
 * 
 * This service handles OpenAI API calls for image generation (DALL-E)
 * and text generation (GPT) for the PawpawStory app.
 */

// API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1';

// OpenAI API Key
const API_KEY = ""; // Safe!

export interface ImageGenerationOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface ImageGenerationResponse {
  url: string;
  revisedPrompt?: string;
}

/**
 * Generate an image using DALL-E 3
 * 
 * @param options - Image generation options
 * @returns Promise with the generated image URL
 */
export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
  const {
    prompt,
    size = '1024x1024',
    quality = 'standard',
    style = 'vivid',
  } = options;

  console.log('[OpenAI] Generating image...');
  console.log('[OpenAI] Prompt:', prompt.substring(0, 100) + '...');

  try {
    const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality,
        style,
      }),
    });

    console.log('[OpenAI] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      console.error('[OpenAI] Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No image generated');
    }

    console.log('[OpenAI] Image generated successfully');
    
    return {
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
    };

  } catch (error) {
    console.error('[OpenAI] Error caught:', error);
    
    if (error instanceof Error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
    throw new Error('Image generation failed: Unknown error');
  }
}

/**
 * Generate a story cover image with a child-friendly style
 * 
 * @param storyTitle - The title of the story
 * @param storyDescription - Brief description of the story
 * @returns Promise with the generated image URL
 */
export async function generateStoryCoverImage(
  storyTitle: string,
  storyDescription: string
): Promise<string> {
  const prompt = `Create a beautiful, child-friendly book cover illustration for the classic fairy tale "${storyTitle}". 
${storyDescription}
Style: Soft watercolor illustration, warm and inviting colors, whimsical and magical atmosphere, suitable for children ages 3-8. 
The image should be charming, gentle, and capture the essence of the story in a single memorable scene.
No text or words in the image.`;

  const result = await generateImage({
    prompt,
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  });

  return result.url;
}

/**
 * Story prompts for cover image generation
 */
export const STORY_IMAGE_PROMPTS: Record<string, string> = {
  'three-little-pigs': 'Three adorable cartoon pigs standing in front of a brick house, one with straw, one with sticks, and one with bricks. A wolf peeks from behind a tree. Soft pastel colors, storybook illustration style.',
  
  'little-red-riding-hood': 'A cute little girl in a red hooded cape walking through a magical sunlit forest path, carrying a basket. Friendly woodland animals peek from behind trees. Warm golden light, whimsical illustration.',
  
  'goldilocks': 'A curious golden-haired girl peeking into a cozy cottage window. Three bowls of porridge on a table visible inside. Warm, inviting colors, fairytale cottage surrounded by flowers.',
  
  'tortoise-and-hare': 'A determined tortoise and a sleeping hare under a tree, with a finish line visible in the distance. Cheerful woodland setting, bright colors, encouraging and playful mood.',
  
  'jack-and-beanstalk': 'A young boy looking up in wonder at an enormous magical beanstalk reaching into fluffy clouds. A small cottage below, magical sparkles around the beanstalk. Dreamy, adventurous atmosphere.',
  
  'cinderella': 'A beautiful girl in a sparkling ball gown with a magical pumpkin carriage behind her. Glass slipper prominent, fairy godmother sparkles in the air. Romantic, magical purple and gold colors.',
  
  'ugly-duckling': 'A small gray duckling looking at its reflection in a pond, with a beautiful white swan silhouette in the water. Gentle sunrise colors, hopeful and touching atmosphere.',
  
  'hansel-and-gretel': 'Two children (boy and girl) holding hands, discovering a magical gingerbread house decorated with colorful candies in a forest clearing. Warm, cozy colors despite the adventure.',
  
  'lion-and-mouse': 'A majestic but gentle lion with a tiny mouse on its paw, both looking at each other with friendship. Soft savanna sunset background, warm golden tones.',
  
  'emperors-new-clothes': 'A proud emperor in his underwear with a golden crown, surrounded by townspeople. A small child pointing and laughing. Humorous but gentle illustration, bright festive colors.',
};

/**
 * Generate all story cover images
 * This is a utility function to generate images for all stories at once
 */
export async function generateAllStoryCoverImages(): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  for (const [storyId, prompt] of Object.entries(STORY_IMAGE_PROMPTS)) {
    console.log(`[OpenAI] Generating cover for: ${storyId}`);
    
    try {
      const result = await generateImage({
        prompt: `Children's book cover illustration: ${prompt} Style: Soft watercolor, warm colors, magical atmosphere, no text.`,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
      });
      
      results[storyId] = result.url;
      console.log(`[OpenAI] Generated cover for ${storyId}: ${result.url}`);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`[OpenAI] Failed to generate cover for ${storyId}:`, error);
      results[storyId] = `https://placehold.co/400x400/FFB6C1/333333?text=${encodeURIComponent(storyId)}`;
    }
  }
  
  return results;
}

