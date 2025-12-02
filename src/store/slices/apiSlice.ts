import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CharacterConnection,
  CharacterNode,
  JikanEpisode,
  JikanImage,
  Media,
} from "../../types";
import { DeezerAlbum } from "../../services/deezerService";

const ANILIST_API_URL = "https://graphql.anilist.co";
const JIKAN_API_URL = "https://api.jikan.moe/v4";
const DEEZER_API_URL = "https://api.deezer.com";

const CORS_PROXIES = [
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://corsproxy.io/?",
  "https://proxy.cors.sh/",
];

// Band member IDs for filtering
const BAND_MEMBER_IDS = {
  blast: [702, 2449, 1424, 2450], // Nana, Nobuo, Shinichi, Yasu
  trapnest: [2089, 1425, 2451, 5341], // Reira, Ren, Takumi, Naoki
};

export interface BandMember {
  character: CharacterNode;
  role: string;
  band: "blast" | "trapnest";
}

export interface BandMembersResponse {
  blast: BandMember[];
  trapnest: BandMember[];
}

const NANA_MEDIA_QUERY = `
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
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
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

const CHARACTERS_QUERY = `
query {
  Media(id: 877, type: ANIME) {
    characters(sort: [ROLE, RELEVANCE], perPage: 50) {
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

interface JikanEpisodesResponse {
  data: JikanEpisode[];
}

interface NanaMediaResponse {
  anime: Media;
  manga: Media;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Characters", "Episodes", "Media", "Volumes", "Album", "BandMembers"],
  endpoints: (builder) => ({
    getNanaMedia: builder.query<NanaMediaResponse, void>({
      queryFn: async () => {
        try {
          const response = await fetch(ANILIST_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ query: NANA_MEDIA_QUERY }),
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: "Failed to fetch NANA media data",
              },
            };
          }

          const json = await response.json();
          return { data: json.data };
        } catch (error) {
          return { error: { status: 500, data: "Network error" } };
        }
      },
      providesTags: ["Media"],
    }),

    getNanaCharacters: builder.query<CharacterConnection, void>({
      queryFn: async () => {
        try {
          const response = await fetch(ANILIST_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ query: CHARACTERS_QUERY }),
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: "Failed to fetch characters",
              },
            };
          }

          const json = await response.json();
          return { data: json.data.Media.characters };
        } catch (error) {
          return { error: { status: 500, data: "Network error" } };
        }
      },
      providesTags: ["Characters"],
    }),

    getBandMembers: builder.query<BandMembersResponse, void>({
      queryFn: async () => {
        try {
          const response = await fetch(ANILIST_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ query: CHARACTERS_QUERY }),
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: "Failed to fetch band members",
              },
            };
          }

          const json = await response.json();
          const characters: CharacterConnection = json.data.Media.characters;

          const blastRoles = ["Vocals", "Guitar", "Bass", "Drums"];
          const trapnestRoles = ["Vocals", "Guitar", "Bass", "Drums"];

          const blast = BAND_MEMBER_IDS.blast
            .map((id, index) => {
              const edge = characters.edges.find((e) => e.node.id === id);
              if (!edge) return null;
              return {
                character: edge.node,
                role: blastRoles[index],
                band: "blast" as const,
              };
            })
            .filter((m) => m !== null) as BandMember[];

          const trapnest = BAND_MEMBER_IDS.trapnest
            .map((id, index) => {
              const edge = characters.edges.find((e) => e.node.id === id);
              if (!edge) return null;
              return {
                character: edge.node,
                role: trapnestRoles[index],
                band: "trapnest" as const,
              };
            })
            .filter((m) => m !== null) as BandMember[];

          return { data: { blast, trapnest } };
        } catch (error) {
          return { error: { status: 500, data: "Network error" } };
        }
      },
      providesTags: ["BandMembers"],
    }),

    getJikanEpisodes: builder.query<JikanEpisode[], number | void>({
      queryFn: async (malId = 877) => {
        try {
          const response = await fetch(
            `${JIKAN_API_URL}/anime/${malId}/episodes`,
          );

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: "Failed to fetch episodes",
              },
            };
          }

          const json: JikanEpisodesResponse = await response.json();
          return { data: json.data || [] };
        } catch (error) {
          return { error: { status: 500, data: "Network error" } };
        }
      },
      providesTags: ["Episodes"],
    }),

    getDeezerAlbum: builder.query<DeezerAlbum, string>({
      queryFn: async (albumId) => {
        const targetUrl = `${DEEZER_API_URL}/album/${albumId}`;

        for (const proxy of CORS_PROXIES) {
          try {
            const proxyUrl = proxy.includes("codetabs")
              ? `${proxy}${targetUrl}`
              : `${proxy}${encodeURIComponent(targetUrl)}`;

            const response = await fetch(proxyUrl);
            if (!response.ok) {
              continue;
            }
            const data = await response.json();
            if (data.error) {
              continue;
            }
            return { data };
          } catch (error) {
            continue;
          }
        }

        return {
          error: {
            status: 503,
            data: "All CORS proxies failed for Deezer album",
          },
        };
      },
      providesTags: (_result, _error, albumId) => [{ type: "Album", id: albumId }],
    }),

    getNanaVolumes: builder.query<JikanImage[], void>({
      queryFn: async () => {
        try {
          const [detailsResponse, picturesResponse] = await Promise.all([
            fetch(`${JIKAN_API_URL}/manga/28`),
            fetch(`${JIKAN_API_URL}/manga/28/pictures`),
          ]);

          if (!detailsResponse.ok || !picturesResponse.ok) {
            return {
              error: {
                status: 500,
                data: "Failed to fetch Nana volumes from Jikan",
              },
            };
          }

          const detailsJson = await detailsResponse.json();
          const picturesJson = await picturesResponse.json();

          const totalVolumes = detailsJson.data.volumes || 0;
          const mainImage = detailsJson.data.images;
          const pictures = picturesJson.data || [];

          const allVolumes: JikanImage[] = Array.from(
            { length: totalVolumes },
            (_, index) => {
              if (index < pictures.length) {
                return pictures[index];
              }
              return mainImage;
            },
          );

          return { data: allVolumes };
        } catch (error) {
          return { error: { status: 500, data: "Network error" } };
        }
      },
      providesTags: ["Volumes"],
    }),
  }),
});

export const {
  useGetNanaMediaQuery,
  useGetNanaCharactersQuery,
  useGetBandMembersQuery,
  useGetJikanEpisodesQuery,
  useGetDeezerAlbumQuery,
  useGetNanaVolumesQuery,
} = apiSlice;
