/**
 * Location AI Service
 * Enhances location precision and data using NVIDIA Qwen3 Coder
 */

import OpenAI from 'openai';
import type { Location } from '../types/game';

// Initialize OpenAI client for NVIDIA API
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY || 'your-api-key-here',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export interface LocationEnhancement {
  refinedCoordinates?: { lat: number; lng: number };
  enhancedDescription?: string;
  verifiedAddress?: string;
  suggestedRadius?: number;
  confidenceScore?: number;
  culturalContext?: string;
  historicalFacts?: string[];
  visitorTips?: string[];
}

/**
 * Enhance location data using AI
 * @param location - Original location data
 * @returns Enhanced location data with improved precision
 */
export async function enhanceLocation(location: Location): Promise<LocationEnhancement> {
  try {
    // Coordinate refinement prompt
    const coordinatePrompt = `Given this location in Capao do Tesouro, BA, Brazil:
    
    Name: ${location.name}
    Current Coordinates: ${location.coordinates.lat}, ${location.coordinates.lng}
    Category: ${location.category}
    Description: ${location.description}
    Address: ${location.address || 'Not provided'}
    
    Please provide:
    1. More precise coordinates if the current ones seem inaccurate
    2. A confidence score (0-1) for the coordinate accuracy
    3. Verification of the address format
    
    Return ONLY a JSON object with this exact structure:
    {
      "refinedCoordinates": {"lat": number, "lng": number},
      "confidenceScore": number,
      "verifiedAddress": "string"
    }`;

    // Description enhancement prompt
    const descriptionPrompt = `Enhance this location description for a treasure hunting game:
    
    Name: ${location.name}
    Category: ${location.category}
    Current Description: ${location.description}
    
    Please provide:
    1. An enriched description with historical/cultural context
    2. 3 interesting historical facts about this location
    3. 3 practical tips for visitors
    4. Cultural significance for local community
    
    Return ONLY a JSON object with this exact structure:
    {
      "enhancedDescription": "string",
      "historicalFacts": ["string", "string", "string"],
      "visitorTips": ["string", "string", "string"],
      "culturalContext": "string"
    }`;

    // Radius suggestion prompt
    const radiusPrompt = `Suggest an optimal check-in radius for this location:
    
    Name: ${location.name}
    Category: ${location.category}
    Description: ${location.description}
    
    Consider:
    - Size of the location
    - Typical visitor experience
    - Safety factors
    - Check-in game mechanics
    
    Return ONLY a JSON object with this exact structure:
    {
      "suggestedRadius": number
    }`;

    // Execute AI enhancements in parallel
    const [coordinateResult, descriptionResult, radiusResult] = await Promise.all([
      openai.chat.completions.create({
        model: import.meta.env.VITE_NVIDIA_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
        messages: [{ role: "user", content: coordinatePrompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
      openai.chat.completions.create({
        model: import.meta.env.VITE_NVIDIA_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
        messages: [{ role: "user", content: descriptionPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
      openai.chat.completions.create({
        model: import.meta.env.VITE_NVIDIA_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
        messages: [{ role: "user", content: radiusPrompt }],
        temperature: 0.4,
        max_tokens: 200,
      })
    ]);

    // Parse AI responses
    const coordinateData = JSON.parse(coordinateResult.choices[0]?.message?.content || '{}');
    const descriptionData = JSON.parse(descriptionResult.choices[0]?.message?.content || '{}');
    const radiusData = JSON.parse(radiusResult.choices[0]?.message?.content || '{}');

    return {
      ...coordinateData,
      ...descriptionData,
      ...radiusData
    };

  } catch (error) {
    console.error('Error enhancing location with AI:', error);
    return {};
  }
}

/**
 * Batch enhance multiple locations
 * @param locations - Array of locations to enhance
 * @returns Array of enhanced locations
 */
export async function enhanceLocations(locations: Location[]): Promise<(Location & LocationEnhancement)[]> {
  const enhancedLocations = await Promise.all(
    locations.map(async (location) => {
      const enhancement = await enhanceLocation(location);
      return { ...location, ...enhancement };
    })
  );
  return enhancedLocations;
}

/**
 * Validate location coordinates using AI
 * @param lat - Latitude
 * @param lng - Longitude
 * @param locationName - Name of the location
 * @returns Validation result with confidence score
 */
export async function validateCoordinates(
  lat: number,
  lng: number,
  locationName: string
): Promise<{ isValid: boolean; confidence: number; suggestedCorrection?: { lat: number; lng: number } }> {
  try {
    const prompt = `Validate these coordinates for "${locationName}" in Capao do Tesouro, BA, Brazil:
    
    Coordinates: ${lat}, ${lng}
    
    Check if these coordinates are reasonable for this location.
    Return ONLY a JSON object with this exact structure:
    {
      "isValid": boolean,
      "confidence": number,
      "suggestedCorrection": {"lat": number, "lng": number} // Only if invalid
    }`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_NVIDIA_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return result;
  } catch (error) {
    console.error('Error validating coordinates:', error);
    return { isValid: true, confidence: 0.5 }; // Conservative default
  }
}

export default {
  enhanceLocation,
  enhanceLocations,
  validateCoordinates
};