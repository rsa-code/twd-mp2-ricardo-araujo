export interface CharacterNode {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
  };
  description?: string;
}

export interface CharacterConnection {
  edges: {
    role: string;
    node: CharacterNode;
  }[];
}

export interface Media {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  type: 'ANIME' | 'MANGA';
  description: string | null;
  bannerImage: string | null;
  coverImage: {
    extraLarge: string;
    large: string;
    color: string;
  };
  genres: string[];
  averageScore: number;
  format: string;
  episodes?: number | null;
  chapters?: number | null;
  status: string;
  characters: CharacterConnection;
}

export interface AniListResponse {
  data: {
    anime: Media;
    manga: Media;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}