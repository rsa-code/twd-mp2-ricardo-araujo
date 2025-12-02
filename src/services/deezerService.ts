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

const DEEZER_API_URL = "https://api.deezer.com";

const CORS_PROXIES = [
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://corsproxy.io/?",
  "https://proxy.cors.sh/",
];

export const fetchDeezerAlbum = async (
  albumId: string,
): Promise<DeezerAlbum | null> => {
  const targetUrl = `${DEEZER_API_URL}/album/${albumId}`;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.includes("codetabs")
        ? `${proxy}${targetUrl}`
        : `${proxy}${encodeURIComponent(targetUrl)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        continue; // Try next proxy
      }
      const data = await response.json();
      if (data.error) {
        continue; // Try next proxy
      }
      return data;
    } catch (error) {
      console.warn(`Proxy ${proxy} failed:`, error);
      continue; // Try next proxy
    }
  }

  console.error("All CORS proxies failed for Deezer album");
  return null;
};
