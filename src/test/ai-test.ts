/**
 * AI Integration Test Script
 * Tests the NVIDIA OpenAI integration with Qwen3 Coder
 */

import { enhanceLocation, validateCoordinates } from '../services/locationAI';
import type { Location } from '../types/game';

async function runAITests() {
  console.log('🚀 Starting AI Integration Tests...');
  
  // Test location
  const testLocation: Location = {
    id: 'test-001',
    name: 'Cachoeira do Tesouro',
    description: 'Cachoeira paradisiaca escondida na mata atlantica',
    coordinates: { lat: -12.4751234, lng: -41.5856789 },
    points: 200,
    radius: 50,
    category: 'nature',
    address: 'Trilha da Cachoeira, km 3 - Zona Rural, Capao do Tesouro - BA',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
    checkedIn: false,
    checkinCount: 0,
  };

  try {
    console.log('\n📝 Testing Location Enhancement...');
    console.log('Location:', testLocation.name);
    console.log('Coordinates:', testLocation.coordinates);
    
    const enhancement = await enhanceLocation(testLocation);
    console.log('\n✨ AI Enhancement Results:');
    console.log('Refined Coordinates:', enhancement.refinedCoordinates);
    console.log('Confidence Score:', enhancement.confidenceScore);
    console.log('Enhanced Description:', enhancement.enhancedDescription?.substring(0, 100) + '...');
    console.log('Cultural Context:', enhancement.culturalContext?.substring(0, 100) + '...');
    console.log('Historical Facts:', enhancement.historicalFacts);
    console.log('Visitor Tips:', enhancement.visitorTips);
    console.log('Suggested Radius:', enhancement.suggestedRadius);

    console.log('\n📍 Testing Coordinate Validation...');
    const validation = await validateCoordinates(
      testLocation.coordinates.lat,
      testLocation.coordinates.lng,
      testLocation.name
    );
    console.log('Validation Result:', validation);

    console.log('\n✅ All AI tests completed successfully!');
    
  } catch (error) {
    console.error('❌ AI Test Failed:', error);
    console.error('Error details:', (error as Error).message);
  }
}

// Run the tests
if (typeof window === 'undefined') {
  // Only run in Node.js environment
  runAITests().catch(console.error);
}

export default runAITests;