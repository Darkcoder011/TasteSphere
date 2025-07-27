const QLOO_API_KEY = 'qzuLeMriOgE8HuaHslZkpSs5fTu-VU4-iukY6dD6J8k';
const BASE_URL = 'https://hackathon.api.qloo.com/v2/insights';

// Mock data for development
const MOCK_RECOMMENDATIONS = {
  movie: [
    {
      id: 'tt1375666',
      name: 'Inception',
      type: 'movie',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      rating: 8.8,
      year: 2010,
      image_url: 'https://via.placeholder.com/300x450?text=Inception'
    },
    {
      id: 'tt0816692',
      name: 'Interstellar',
      type: 'movie',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      rating: 8.6,
      year: 2014,
      image_url: 'https://via.placeholder.com/300x450?text=Interstellar'
    },
    {
      id: 'tt0111161',
      name: 'The Shawshank Redemption',
      type: 'movie',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      rating: 9.3,
      year: 1994,
      image_url: 'https://via.placeholder.com/300x450?text=Shawshank+Redemption'
    }
  ],
  book: [
    {
      id: 'b1',
      name: 'Dune',
      type: 'book',
      author: 'Frank Herbert',
      description: 'A science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.',
      rating: 4.2,
      year: 1965,
      image_url: 'https://via.placeholder.com/300x450?text=Dune'
    },
    {
      id: 'b2',
      name: 'The Martian',
      type: 'book',
      author: 'Andy Weir',
      description: 'An astronaut becomes stranded on Mars and must find a way to survive.',
      rating: 4.4,
      year: 2011,
      image_url: 'https://via.placeholder.com/300x450?text=The+Martian'
    }
  ],
  artist: [
    {
      id: 'a1',
      name: 'Tame Impala',
      type: 'artist',
      description: 'Australian musical project of multi-instrumentalist Kevin Parker known for psychedelic music.',
      genre: 'Psychedelic Pop',
      image_url: 'https://via.placeholder.com/300x300?text=Tame+Impala'
    },
    {
      id: 'a2',
      name: 'Beach House',
      type: 'artist',
      description: 'American dream pop band known for their dreamy, atmospheric sound.',
      genre: 'Dream Pop',
      image_url: 'https://via.placeholder.com/300x300?text=Beach+House'
    }
  ],
  tv_show: [
    {
      id: 'tv1',
      name: 'Stranger Things',
      type: 'tv_show',
      description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      rating: 8.7,
      year: 2016,
      image_url: 'https://via.placeholder.com/300x450?text=Stranger+Things'
    }
  ],
  place: [
    {
      id: 'p1',
      name: 'Central Park',
      type: 'place',
      location: 'New York, NY',
      description: 'An urban park in Manhattan, New York City, between the Upper West and Upper East Sides of Manhattan.',
      image_url: 'https://via.placeholder.com/300x200?text=Central+Park'
    }
  ]
};

/**
 * Fetch recommendations from Qloo API or return mock data in development
 * @param {string} entityType - Type of entity to get recommendations for (e.g., 'movie', 'book')
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Promise<Array>} Array of recommendation objects
 */
export const fetchRecommendations = async (entityType, limit = 5) => {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_RECOMMENDATIONS[entityType]?.slice(0, limit) || []);
      }, 800); // Simulate network delay
    });
  }

  // In production, call the real Qloo API
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('filter.type', `urn:entity:${entityType}`);
    url.searchParams.append('take', limit.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': QLOO_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Qloo API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to match our expected format
    return data.data?.map(item => ({
      id: item.id,
      name: item.name,
      type: entityType,
      description: item.description || item.bio || '',
      rating: item.rating,
      year: item.year,
      image_url: item.image_url || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.name)}`
    })) || [];
    
  } catch (error) {
    console.error('Error fetching recommendations from Qloo:', error);
    // Fall back to mock data if API call fails
    return MOCK_RECOMMENDATIONS[entityType]?.slice(0, limit) || [];
  }
};

/**
 * Generate a Qloo API URL for a given entity type and parameters
 * @param {string} entityType - Type of entity (e.g., 'movie', 'book')
 * @param {Object} params - Additional query parameters
 * @returns {string} Generated API URL
 */
export const generateQlooUrl = (entityType, params = {}) => {
  const url = new URL(BASE_URL);
  url.searchParams.append('filter.type', `urn:entity:${entityType}`);
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.toString();
};

export default {
  fetchRecommendations,
  generateQlooUrl
};
