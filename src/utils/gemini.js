// Mock implementation of Gemini API for development
const MOCK_ENTITIES = {
  'sci-fi': [
    { type: 'movie', name: 'Dune', description: 'A science fiction novel by Frank Herbert' },
    { type: 'movie', name: 'The Matrix', description: 'A computer hacker learns about the true nature of reality' },
    { type: 'tv_show', name: 'The Expanse', description: 'A thriller set two hundred years in the future' },
  ],
  'indie music': [
    { type: 'artist', name: 'Tame Impala', description: 'Australian musical project of multi-instrumentalist Kevin Parker' },
    { type: 'artist', name: 'Beach House', description: 'American dream pop band from Baltimore, Maryland' },
  ],
  'mystery books': [
    { type: 'book', name: 'Gone Girl', author: 'Gillian Flynn', description: 'A woman disappears on her fifth wedding anniversary' },
    { type: 'book', name: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', description: 'A journalist and a hacker investigate a 40-year-old disappearance' },
  ],
  'new york restaurants': [
    { type: 'place', name: 'Katz\'s Delicatessen', description: 'Iconic Jewish deli known for its pastrami on rye' },
    { type: 'place', name: 'Le Bernardin', description: 'Upscale French seafood restaurant' },
  ]
};

/**
 * Mock implementation of Gemini API for development
 * @param {string} text - User input text
 * @returns {Promise<{entities: Array<{type: string, name: string}>, analysis: string}>}
 */
export const analyzeWithGeminiMock = async (text) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple keyword matching for demo purposes
  const lowerText = text.toLowerCase();
  let matchedEntities = [];
  let analysis = "";
  
  // Check for known patterns
  if (lowerText.includes('sci-fi') || lowerText.includes('science fiction')) {
    matchedEntities.push({ type: 'movie', name: 'Sci-Fi Movies' });
    analysis += "I see you're interested in science fiction. "
  }
  
  if (lowerText.includes('indie') && (lowerText.includes('music') || lowerText.includes('band'))) {
    matchedEntities.push({ type: 'artist', name: 'Indie Music' });
    analysis += "You seem to enjoy indie music. "
  }
  
  if (lowerText.includes('mystery') && (lowerText.includes('book') || lowerText.includes('novel'))) {
    matchedEntities.push({ type: 'book', name: 'Mystery Books' });
    analysis += "Mystery books are a great choice! "
  }
  
  if (lowerText.includes('new york') && (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('eat'))) {
    matchedEntities.push({ type: 'place', name: 'New York Restaurants' });
    analysis += "Looking for great places to eat in New York? "
  }
  
  // If no specific entities matched, provide a generic response
  if (matchedEntities.length === 0) {
    matchedEntities = [
      { type: 'movie', name: 'Popular Movies' },
      { type: 'book', name: 'Bestselling Books' },
      { type: 'artist', name: 'Trending Artists' },
    ];
    analysis = "Here are some general recommendations based on your interests. " +
               "You can be more specific to get personalized suggestions!";
  } else {
    analysis += "Here are some recommendations based on your interests.";
  }
  
  return {
    entities: matchedEntities,
    analysis,
    // Include mock data for the matched categories
    mockData: matchedEntities.reduce((acc, entity) => {
      const key = entity.name.toLowerCase();
      if (MOCK_ENTITIES[key]) {
        acc[entity.type] = MOCK_ENTITIES[key];
      }
      return acc;
    }, {})
  };
};

/**
 * Real implementation using Gemini API
 * @param {string} text - User input text
 * @returns {Promise<{entities: Array<{type: string, name: string}>, analysis: string}>}
 */
export const analyzeWithGemini = async (text) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDDPRL9LeYPR_l_JhoJRd9ZS1hZKITJ-Qg';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  try {
    console.log('Sending request to Gemini API with text:', text);
    
    const prompt = `Analyze the following text and extract entities with their types (movie, book, artist, tv_show, podcast, place, brand, person, destination). 
    Return a valid JSON object with two fields: 
    1. "entities": an array of objects with "type" and "name" properties
    2. "analysis": a friendly explanation of the user's interests
    
    Example response:
    {
      "entities": [
        {"type": "movie", "name": "Inception"},
        {"type": "book", "name": "Dune"}
      ],
      "analysis": "You seem to enjoy science fiction content, particularly movies and books with complex narratives."
    }
    
    Text to analyze: "${text}"
    
    Respond with only the JSON object, no additional text or markdown formatting.`;
    
    console.log('Sending request to Gemini API...');
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    });
    
    console.log('Received response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    try {
      // Get the response text
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      console.log('Raw Gemini response content:', content);
      
      // Clean the response by removing markdown code blocks if present
      let jsonContent = content.trim();
      
      // Handle code blocks
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\n|\n```$/g, '').trim();
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\n|\n```$/g, '').trim();
      }
      
      // Remove any non-JSON content before and after the JSON
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      console.log('Cleaned JSON content:', jsonContent);
      
      // Parse the JSON content
      const result = JSON.parse(jsonContent);
      console.log('Parsed result:', result);
      
      // Validate the response structure
      if (!result.entities || !Array.isArray(result.entities)) {
        console.error('Invalid entities format in response:', result);
        throw new Error('Invalid entities format in response');
      }
      
      // Ensure analysis field exists
      if (!result.analysis) {
        result.analysis = "Here are some recommendations based on your interests.";
      }
      
      return result;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse Gemini API response');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fall back to mock data in case of API failure
    console.log('Falling back to mock data');
    return analyzeWithGeminiMock(text);
  }
};

// Export the appropriate function based on environment
// In production, you might want to use the real API
const useMock = process.env.NODE_ENV === 'development';
export default useMock ? analyzeWithGeminiMock : analyzeWithGemini;
