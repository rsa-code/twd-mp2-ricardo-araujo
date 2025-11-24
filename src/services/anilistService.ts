import { AniListResponse, Media } from '../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const QUERY = `
query {
  anime: Media(id: 877, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    type
    description(asHtml: true)
    bannerImage
    coverImage {
      extraLarge
      large
      color
    }
    genres
    averageScore
    format
    episodes
    status
    characters(sort: [ROLE], perPage: 12) {
      edges {
        role
        node {
          id
          name {
            full
            native
          }
          image {
            large
          }
          description
        }
      }
    }
  }
  manga: Media(id: 30028, type: MANGA) {
    id
    title {
      romaji
      english
      native
    }
    type
    description(asHtml: true)
    bannerImage
    coverImage {
      extraLarge
      large
      color
    }
    genres
    averageScore
    format
    chapters
    status
    characters(sort: [ROLE], perPage: 12) {
      edges {
        role
        node {
          id
          name {
            full
            native
          }
          image {
            large
          }
          description
        }
      }
    }
  }
}
`;

export const fetchNanaData = async (): Promise<{ anime: Media; manga: Media } | null> => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AniList API Error:', errorText);
      throw new Error('Network response was not ok');
    }

    const json: AniListResponse = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching NANA data:', error);
    return null;
  }
};