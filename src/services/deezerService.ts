export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string;
  link: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover_xl: string;
  label: string;
  release_date: string;
  tracks: {
    data: DeezerTrack[];
  };
  link: string;
  artist: {
    name: string;
  };
}

const DEEZER_API_URL = 'https://api.deezer.com';
const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchDeezerAlbum = async (albumId: string): Promise<DeezerAlbum | null> => {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${DEEZER_API_URL}/album/${albumId}`)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data;
  } catch (error) {
    console.error('Error fetching Deezer album:', error);
    return null;
  }
};
