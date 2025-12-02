import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CharacterConnection } from '../../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

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

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getNanaCharacters: builder.query<CharacterConnection, void>({
      queryFn: async () => {
        try {
          const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ query: CHARACTERS_QUERY }),
          });

          if (!response.ok) {
            return { error: { status: response.status, data: 'Failed to fetch characters' } };
          }

          const json = await response.json();
          return { data: json.data.Media.characters };
        } catch (error) {
          return { error: { status: 500, data: 'Network error' } };
        }
      },
    }),
  }),
});

export const { useGetNanaCharactersQuery } = apiSlice;
