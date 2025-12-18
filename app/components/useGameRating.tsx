import { useState, useEffect } from 'react';
import gamebrainService, { GameBrainRating } from '../service/gamebrainService';

export const useGameRating = (gameName: string) => {
  const [rating, setRating] = useState<GameBrainRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRating = async () => {
      if (!gameName.trim()) {
        setRating(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await gamebrainService.searchAndGetRating(gameName);
        
        if (mounted) {
          setRating(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch rating');
          setRating(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchRating, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [gameName]);

  return {
    rating,
    loading,
    error,
    formattedRating: rating ? gamebrainService.getFormattedRating(rating) : null,
    starRating: rating ? gamebrainService.getStarRating(rating) : null,
  };
};