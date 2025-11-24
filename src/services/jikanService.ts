import { JikanEpisode } from '../types';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export const fetchJikanEpisodes = async (malId: number = 877): Promise<JikanEpisode[]> => {
  try {
    const response = await fetch(`${JIKAN_API_BASE}/anime/${malId}/episodes`);
    if (!response.ok) {
      throw new Error('Failed to fetch episodes from Jikan');
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching Jikan episodes:', error);
    return [];
  }
};
