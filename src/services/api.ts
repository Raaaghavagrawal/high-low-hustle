import { ComparisonItem } from '../types';

const UNSPLASH_API = 'https://api.unsplash.com';
const PEXELS_API = 'https://api.pexels.com/v1';
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

// Enhanced cache that stores multiple images per category
const imageCache: {
  [key: string]: { url: string; photographer: string };
} = {};

// Cache for category images to avoid repetition
const categoryImageCache: {
  [category: string]: Set<string>;
} = {};

// Function to check if image URL is already used in category
const isImageUsedInCategory = (category: string, imageUrl: string): boolean => {
  if (!categoryImageCache[category]) {
    categoryImageCache[category] = new Set();
  }
  return categoryImageCache[category].has(imageUrl);
};

// Function to add image to category cache
const addImageToCategory = (category: string, imageUrl: string) => {
  if (!categoryImageCache[category]) {
    categoryImageCache[category] = new Set();
  }
  categoryImageCache[category].add(imageUrl);
};

// Category-specific fallback images
const FALLBACK_IMAGES = {
  Celebrities: {
    Actors: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1200&h=800&q=85',
    Musicians: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=800&q=85',
    Athletes: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&h=800&q=85'
  },
  Technology: {
    Smartphones: 'https://images.unsplash.com/photo-1592434134753-a70d6f61d37c?auto=format&fit=crop&w=1200&h=800&q=85',
    Gaming: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1200&h=800&q=85',
    Software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=800&q=85'
  },
  Automotive: {
    Luxury: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=800&q=85',
    Electric: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&h=800&q=85',
    Sports: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&h=800&q=85'
  },
  Entertainment: {
    Movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&h=800&q=85',
    TVShows: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&h=800&q=85',
    Games: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&h=800&q=85'
  },
  Sports: {
    Teams: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=1200&h=800&q=85',
    Events: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&h=800&q=85'
  },
  Brands: {
    Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&h=800&q=85',
    Tech: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&h=800&q=85',
    Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=800&q=85'
  }
};

// Define types for the content pool
type ContentItem = string;
type SubCategory = { [key: string]: ContentItem[] };
type ContentPool = { [key: string]: SubCategory };

// Categories and their items for dynamic content generation
const CONTENT_POOL: ContentPool = {
  Celebrities: {
    Actors: [
      'Tom Cruise', 'Brad Pitt', 'Leonardo DiCaprio', 'Jennifer Lawrence', 'Scarlett Johansson',
      'Robert Downey Jr', 'Morgan Freeman', 'Will Smith', 'Tom Hanks', 'Johnny Depp'
    ],
    Musicians: [
      'Taylor Swift', 'Ed Sheeran', 'Drake', 'Beyoncé', 'The Weeknd', 'BTS', 'Lady Gaga',
      'Eminem', 'Rihanna', 'Justin Bieber'
    ],
    Athletes: [
      'Cristiano Ronaldo', 'Lionel Messi', 'LeBron James', 'Roger Federer', 'Serena Williams',
      'Michael Jordan', 'Usain Bolt', 'Tiger Woods', 'Rafael Nadal', 'Virat Kohli'
    ]
  },
  Technology: {
    Smartphones: [
      'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'OnePlus 12',
      'Xiaomi 14 Pro', 'Nothing Phone 2', 'ASUS ROG Phone 8', 'Sony Xperia 1 V'
    ],
    Gaming: [
      'PlayStation 5', 'Xbox Series X', 'Nintendo Switch OLED', 'Steam Deck',
      'ROG Ally', 'PlayStation VR2', 'Meta Quest 3'
    ],
    Software: [
      'ChatGPT', 'Microsoft Office', 'Adobe Photoshop', 'Zoom', 'Slack',
      'Visual Studio Code', 'Unity Engine', 'Unreal Engine 5'
    ]
  },
  Automotive: {
    Luxury: [
      'Rolls-Royce Phantom', 'Bentley Continental GT', 'Mercedes-Maybach S-Class',
      'Porsche 911 GT3', 'Lamborghini Huracán', 'Ferrari SF90', 'McLaren 720S'
    ],
    Electric: [
      'Tesla Model S Plaid', 'Lucid Air', 'Rivian R1T', 'Porsche Taycan',
      'BMW i7', 'Mercedes EQS', 'Audi e-tron GT'
    ],
    Sports: [
      'Bugatti Chiron', 'Koenigsegg Jesko', 'Pagani Huayra', 'Aston Martin Valkyrie',
      'McLaren P1', 'Ferrari LaFerrari', 'Porsche 918 Spyder'
    ]
  },
  Entertainment: {
    Movies: [
      'Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars', 'Jurassic World',
      'The Lion King', 'Top Gun: Maverick', 'Barbie'
    ],
    TVShows: [
      'Stranger Things', 'Game of Thrones', 'Breaking Bad', 'The Last of Us',
      'Wednesday', 'The Mandalorian', 'House of the Dragon'
    ],
    Games: [
      'Minecraft', 'GTA V', 'The Legend of Zelda', 'Cyberpunk 2077',
      'Red Dead Redemption 2', 'Elden Ring', 'God of War Ragnarök'
    ]
  },
  Sports: {
    Teams: [
      'Real Madrid', 'Manchester United', 'Los Angeles Lakers', 'New York Yankees',
      'Dallas Cowboys', 'Golden State Warriors', 'Chicago Bulls'
    ],
    Events: [
      'FIFA World Cup', 'Olympics', 'Super Bowl', 'UEFA Champions League',
      'Wimbledon', 'NBA Finals', 'Formula 1 World Championship'
    ]
  },
  Brands: {
    Fashion: [
      'Louis Vuitton', 'Gucci', 'Nike', 'Adidas', 'Rolex', 'Hermès', 'Chanel',
      'Prada', 'Supreme', 'Off-White'
    ],
    Tech: [
      'Apple', 'Samsung', 'Google', 'Microsoft', 'Amazon', 'Meta', 'NVIDIA',
      'Tesla', 'Sony', 'Intel'
    ],
    Food: [
      'McDonald\'s', 'Starbucks', 'Coca-Cola', 'PepsiCo', 'KFC', 'Subway',
      'Domino\'s Pizza', 'Burger King'
    ]
  }
};

// Item-specific search queries for better image matching
const ITEM_SPECIFIC_QUERIES: { [key: string]: string } = {
  // Celebrities - Actors
  'Tom Cruise': 'Tom Cruise actor portrait recent',
  'Brad Pitt': 'Brad Pitt actor portrait recent',
  'Leonardo DiCaprio': 'Leonardo DiCaprio actor portrait recent',
  'Jennifer Lawrence': 'Jennifer Lawrence actress portrait recent',
  'Scarlett Johansson': 'Scarlett Johansson actress portrait recent',
  
  // Musicians
  'Taylor Swift': 'Taylor Swift singer recent',
  'Ed Sheeran': 'Ed Sheeran performing recent',
  'Drake': 'Drake rapper performing recent',
  'Beyoncé': 'Beyonce singer performing recent',
  'BTS': 'BTS group official recent',
  
  // Athletes
  'Cristiano Ronaldo': 'Cristiano Ronaldo playing soccer recent',
  'Lionel Messi': 'Lionel Messi playing soccer recent',
  'LeBron James': 'LeBron James playing basketball Lakers',
  
  // Products
  'iPhone 15 Pro Max': 'iPhone 15 Pro Max product official',
  'Samsung Galaxy S24 Ultra': 'Samsung Galaxy S24 Ultra product official',
  'PlayStation 5': 'PlayStation 5 console product',
  'Xbox Series X': 'Xbox Series X console product',
  'Nintendo Switch OLED': 'Nintendo Switch OLED product',
  
  // Cars
  'Tesla Model S Plaid': 'Tesla Model S Plaid car official',
  'Porsche 911 GT3': 'Porsche 911 GT3 car official',
  'Ferrari SF90': 'Ferrari SF90 car official',
  'McLaren 720S': 'McLaren 720S car official',
  
  // Movies & Shows
  'Avatar': 'Avatar Way of Water movie poster',
  'Avengers: Endgame': 'Avengers Endgame movie poster',
  'Stranger Things': 'Stranger Things show poster',
  'Game of Thrones': 'Game of Thrones show poster',
  'Breaking Bad': 'Breaking Bad show poster',
  
  // Games
  'Minecraft': 'Minecraft game official',
  'GTA V': 'Grand Theft Auto V game cover',
  'The Legend of Zelda': 'Zelda Tears of Kingdom game',
  'Cyberpunk 2077': 'Cyberpunk 2077 game cover',
  
  // Sports Teams
  'Real Madrid': 'Real Madrid soccer team logo',
  'Manchester United': 'Manchester United soccer team logo',
  'Los Angeles Lakers': 'LA Lakers basketball team logo',
  
  // Brands
  'Louis Vuitton': 'Louis Vuitton logo store',
  'Gucci': 'Gucci logo store',
  'Nike': 'Nike logo store',
  'Apple': 'Apple company logo',
  'McDonald\'s': 'McDonalds restaurant logo'
};

const getSearchQuery = (item: { term: string; category: string; subcategory: string }): string => {
  // Use item-specific query if available
  if (ITEM_SPECIFIC_QUERIES[item.term]) {
    return ITEM_SPECIFIC_QUERIES[item.term];
  }

  // Fallback to a more specific search based on category
  switch (item.category) {
    case 'Celebrities':
      return `${item.term} ${item.subcategory.toLowerCase()} portrait recent`;
    case 'Technology':
      return `${item.term} product official`;
    case 'Automotive':
      return `${item.term} car official exterior`;
    case 'Entertainment':
      switch (item.subcategory) {
        case 'Movies':
          return `${item.term} movie poster official`;
        case 'TVShows':
          return `${item.term} tv show poster`;
        case 'Games':
          return `${item.term} game cover art`;
        default:
          return `${item.term} official`;
      }
    case 'Sports':
      return `${item.term} ${item.subcategory.toLowerCase()} official`;
    case 'Brands':
      return `${item.term} brand logo official`;
    default:
      return `${item.term} official`;
  }
};

// Function to get a random item from nested categories
const getRandomItem = () => {
  const categories = Object.keys(CONTENT_POOL);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const subcategories = Object.keys(CONTENT_POOL[randomCategory]);
  const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
  const items = CONTENT_POOL[randomCategory][randomSubcategory];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  
  return {
    term: randomItem,
    category: randomCategory,
    subcategory: randomSubcategory
  };
};

// Base volumes for different categories
const BASE_VOLUMES: { [key: string]: { min: number; max: number } } = {
  Celebrities: { min: 500000000, max: 2000000000 },
  Technology: { min: 300000000, max: 1500000000 },
  Automotive: { min: 200000000, max: 1000000000 },
  Entertainment: { min: 400000000, max: 1800000000 },
  Sports: { min: 300000000, max: 1600000000 },
  Brands: { min: 400000000, max: 1700000000 }
};

const getRandomSearchVolume = (category: string) => {
  const { min, max } = BASE_VOLUMES[category] || { min: 200000000, max: 1000000000 };
  return Math.floor(min + Math.random() * (max - min));
};

const getFallbackImage = (category: string, subcategory: string): string => {
  return FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES]?.[subcategory as keyof (typeof FALLBACK_IMAGES)[keyof typeof FALLBACK_IMAGES]] ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=800&q=85';
};

const fetchPexelsImage = async (searchQuery: string, category: string): Promise<{ url: string; photographer: string } | null> => {
  if (!PEXELS_API_KEY) return null;

  try {
    const response = await fetch(
      `${PEXELS_API}/search?query=${encodeURIComponent(searchQuery)}&per_page=25&orientation=landscape&size=large`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.photos?.length) return null;

    // Try to find an unused image in the results
    for (const photo of data.photos) {
      const imageUrl = `${photo.src.large2x}?auto=format&fit=crop&w=1200&h=800&q=85`;
      if (!isImageUsedInCategory(category, imageUrl)) {
        addImageToCategory(category, imageUrl);
        return {
          url: imageUrl,
          photographer: photo.photographer
        };
      }
    }

    // If all images are used, clear cache for this category and use the first image
    categoryImageCache[category] = new Set();
    const photo = data.photos[0];
    const imageUrl = `${photo.src.large2x}?auto=format&fit=crop&w=1200&h=800&q=85`;
    addImageToCategory(category, imageUrl);
    return {
      url: imageUrl,
      photographer: photo.photographer
    };
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
};

// Add type definitions for Unsplash API responses
interface UnsplashImage {
  urls: {
    regular: string;
  };
  user: {
    name: string;
  };
  description: string | null;
  alt_description: string | null;
}

const fetchUnsplashImage = async (item: { term: string; category: string; subcategory: string }): Promise<{ url: string; photographer: string }> => {
  const searchQuery = getSearchQuery(item);
  let result: { url: string; photographer: string } | null = null;

  // Try Unsplash first with specific search
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const response = await fetch(
        `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=30&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            'Accept-Version': 'v1'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results?.length) {
          // First try to find an exact match (containing the item name)
          const exactMatches = data.results.filter((image: UnsplashImage) => 
            image.description?.toLowerCase().includes(item.term.toLowerCase()) ||
            image.alt_description?.toLowerCase().includes(item.term.toLowerCase())
          );

          const potentialImages = exactMatches.length > 0 ? exactMatches : data.results;
          
          // Try to find an unused image from our filtered results
          for (const image of potentialImages as UnsplashImage[]) {
            const imageUrl = image.urls.regular + '&auto=format&fit=crop&w=1200&h=800&q=85';
            if (!isImageUsedInCategory(item.category, imageUrl)) {
              addImageToCategory(item.category, imageUrl);
              result = {
                url: imageUrl,
                photographer: image.user.name
              };
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching Unsplash image:', error);
    }
  }

  // If Unsplash failed, try Pexels with specific search
  if (!result) {
    result = await fetchPexelsImage(searchQuery, item.category);
  }

  // If both failed, try a more generic search
  if (!result) {
    const genericQuery = `${item.term} ${item.category.toLowerCase()}`;
    result = await fetchPexelsImage(genericQuery, item.category);
  }

  // If still no result, use category-specific fallback
  if (!result) {
    const fallbackUrl = getFallbackImage(item.category, item.subcategory);
    if (!isImageUsedInCategory(item.category, fallbackUrl)) {
      addImageToCategory(item.category, fallbackUrl);
      result = {
        url: fallbackUrl,
        photographer: 'Stock Photo'
      };
    } else {
      // Try to find an alternative fallback from the same category
      const alternativeFallback = Object.values(FALLBACK_IMAGES[item.category as keyof typeof FALLBACK_IMAGES] || {})
        .find(url => !isImageUsedInCategory(item.category, url));
      
      const finalUrl = alternativeFallback || fallbackUrl;
      addImageToCategory(item.category, finalUrl);
      result = {
        url: finalUrl,
        photographer: 'Stock Photo'
      };
    }
  }

  return result;
};

export const fetchRandomItem = async (): Promise<ComparisonItem> => {
  const randomItem = getRandomItem();
  
  try {
    const { url: imageUrl, photographer } = await fetchUnsplashImage(randomItem);

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: randomItem.term,
      description: `Search popularity for ${randomItem.term} (${randomItem.subcategory})`,
      searchVolume: getRandomSearchVolume(randomItem.category),
      imageUrl,
      category: `${randomItem.category} - ${randomItem.subcategory}`,
      photographer
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: randomItem.term,
      description: `Search popularity for ${randomItem.term} (${randomItem.subcategory})`,
      searchVolume: getRandomSearchVolume(randomItem.category),
      imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=800&q=85`,
      category: `${randomItem.category} - ${randomItem.subcategory}`,
      photographer: 'Unsplash'
    };
  }
}; 