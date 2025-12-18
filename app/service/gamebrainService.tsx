import axios from 'axios';

// Base URL for GameBrain API
const GAMEBRAIN_API_BASE = 'https://api.gamebrain.co/v1';

// You'll need to get an API key from GameBrain
const API_KEY = '57f5a07c270c4b80a44556f01aa51065';

// Interfaces based on the API documentation
export interface GameBrainRating {
  mean: number;              // Rating mean (0-1 scale)
  count: number;             // Total number of ratings
  mean_players?: number;     // Player rating mean
  count_players?: number;    // Player rating count
  mean_critics?: number;     // Critic rating mean
  count_critics?: number;    // Critic rating count
}

export interface GameBrainSearchResult {
  id: number;
  name: string;
  year: number;
  genre: string;
  image: string;
  link: string;
  rating: GameBrainRating;
  adult_only: boolean;
  screenshots: string[];
  micro_trailer?: string;
  gameplay?: string;
  short_description: string;
  platforms: Array<{
    value: string;
    name: string;
  }>;
  arcadia?: boolean;
}

export interface GameBrainGameDetails {
  id: number;
  name: string;
  image: string;
  gameplay?: string;
  link: string;
  x_url?: string;
  rating: GameBrainRating;
  description: string;
  short_description: string;
  release_date: string;
  developer: string;
  playtime: {
    percentiles: number[];
    min: number;
    median: number;
    max: number;
    mean: number;
    mentions: number;
  };
  platforms: Array<{
    value: string;
    name: string;
  }>;
  tags: string[];
  genres: Array<{
    value: string;
    name: string;
  }>;
  genre: string;
  themes: Array<{
    value: string;
    name: string;
  }>;
  adult_only: boolean;
  play_modes: Array<{
    value: string;
    name: string;
  }>;
  screenshots: string[];
  videos: string[];
  offers: Array<{
    price: {
      currency: string;
      discount_percent: number;
      value: number;
      initial: number;
    };
    store_name: string;
    platform: string;
    title: string;
    url: string;
  }>;
  official_stores: Array<{
    source: string;
    url: string;
  }>;
  micro_trailer?: string;
}

// Define proper types for filter options
export interface FilterOptionValue {
  name: string;
  key: string;
  count?: number;
  match?: string;
  value?: string;
}

export interface FilterOption {
  name: string;
  key: string;
  values: FilterOptionValue[];
  filter_type: string;
  filter_connection: string;
}

export interface ActiveFilterValue {
  match?: string;
  value: string;
}

export interface ActiveFilterOption {
  key: string;
  connection: string;
  values: ActiveFilterValue[];
}

export interface GameBrainSearchResponse {
  sorting: {
    key: string | null;
    direction: string | null;
  };
  active_filter_options: ActiveFilterOption[];
  query: string;
  total_results: number;
  limit: number;
  offset: number;
  results: GameBrainSearchResult[];
  filter_options: FilterOption[];
}

// Create axios instance with default config
const gamebrainApi = axios.create({
  baseURL: GAMEBRAIN_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Add request/response interceptors for debugging
gamebrainApi.interceptors.request.use(
  (config) => {
    console.log(`GameBrain API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('GameBrain API Request Error:', error);
    return Promise.reject(error);
  }
);

gamebrainApi.interceptors.response.use(
  (response) => {
    console.log(`GameBrain API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('GameBrain API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

class GameBrainService {
  /**
   * Search for games by name
   * @param query Search query (e.g., "medieval strategy games")
   * @param limit Number of results (1-10)
   * @param offset Pagination offset (0-1000)
   */
  async searchGames(
    query: string, 
    limit: number = 10, 
    offset: number = 0
  ): Promise<GameBrainSearchResponse> {
    try {
      const response = await gamebrainApi.get<GameBrainSearchResponse>('/games', {
        params: {
          query,
          limit,
          offset,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching games:', error);
      throw new Error('Failed to search games');
    }
  }

  /**
   * Get detailed game information including rating
   * @param gameId The ID of the game from search results
   */
  async getGameDetails(gameId: number): Promise<GameBrainGameDetails> {
    try {
      const response = await gamebrainApi.get<GameBrainGameDetails>(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game details for ID ${gameId}:`, error);
      throw new Error(`Failed to fetch game details for ID ${gameId}`);
    }
  }

  /**
   * Get game rating specifically
   * @param gameId The ID of the game
   */
  async getGameRating(gameId: number): Promise<GameBrainRating> {
    try {
      const response = await gamebrainApi.get<GameBrainGameDetails>(`/games/${gameId}`);
      return response.data.rating;
    } catch (error) {
      console.error(`Error fetching game rating for ID ${gameId}:`, error);
      throw new Error(`Failed to fetch game rating for ID ${gameId}`);
    }
  }

  /**
   * Search for a game by name and get its rating
   * This is useful when you only have the game name
   * @param gameName The name of the game to search for
   */
  async searchAndGetRating(gameName: string): Promise<GameBrainRating | null> {
    try {
      // First search for the game
      const searchResults = await this.searchGames(gameName, 1);
      
      if (searchResults.results.length === 0) {
        console.log(`No game found for: ${gameName}`);
        return null;
      }

      // Get the first result's rating
      const gameId = searchResults.results[0].id;
      return await this.getGameRating(gameId);
    } catch (error) {
      console.error(`Error searching and getting rating for ${gameName}:`, error);
      return null;
    }
  }

  /**
   * Convert GameBrain rating (0-1 scale) to a percentage (0-100)
   * @param rating GameBrain rating object
   */
  convertRatingToPercentage(rating: GameBrainRating): number {
    return Math.round(rating.mean * 100);
  }

  /**
   * Get a formatted rating string (e.g., "85%")
   * @param rating GameBrain rating object
   */
  getFormattedRating(rating: GameBrainRating): string {
    const percentage = this.convertRatingToPercentage(rating);
    return `${percentage}%`;
  }

  /**
   * Get a star rating (1-5 stars) based on GameBrain rating
   * @param rating GameBrain rating object
   */
  getStarRating(rating: GameBrainRating): number {
    const percentage = this.convertRatingToPercentage(rating);
    // Convert percentage to 1-5 stars
    return Math.round((percentage / 100) * 5);
  }
}

// Export a singleton instance (fixes the import/no-anonymous-default-export warning)
const gamebrainServiceInstance = new GameBrainService();
export default gamebrainServiceInstance;