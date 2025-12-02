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

export interface StreamingEpisode {
  title: string;
  thumbnail: string;
  url: string;
  site: string;
}

export interface Media {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  type: "ANIME" | "MANGA";
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
  streamingEpisodes?: StreamingEpisode[];
  characters: CharacterConnection;
}

export interface AniListResponse {
  data: {
    anime: Media;
    manga: Media;
  };
}

export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string;
  title_romanji: string;
  aired: string;
  score: number;
  filler: boolean;
  recap: boolean;
  forum_url: string;
}

export interface JikanImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}
