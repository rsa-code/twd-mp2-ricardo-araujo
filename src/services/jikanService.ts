import { JikanEpisode, JikanImage } from "../types";

const JIKAN_API_BASE = "https://api.jikan.moe/v4";

export const fetchJikanEpisodes = async (
  malId: number = 877,
): Promise<JikanEpisode[]> => {
  try {
    console.log(`Fetching Jikan episodes for MAL ID: ${malId}`);
    const response = await fetch(`${JIKAN_API_BASE}/anime/${malId}/episodes`);
    if (!response.ok) {
      throw new Error(`Jikan API Error: ${response.statusText}`);
    }
    const json = await response.json();
    console.log("Jikan response:", json);
    return json.data || [];
  } catch (error) {
    console.error("Error fetching Jikan episodes:", error);
    throw error;
  }
};

export const fetchNanaVolumes = async (): Promise<JikanImage[]> => {
  try {
    const [detailsResponse, picturesResponse] = await Promise.all([
      fetch(`${JIKAN_API_BASE}/manga/28`),
      fetch(`${JIKAN_API_BASE}/manga/28/pictures`),
    ]);

    if (!detailsResponse.ok || !picturesResponse.ok) {
      throw new Error("Failed to fetch Nana data from Jikan");
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

    return allVolumes;
  } catch (error) {
    console.error("Error fetching Nana volumes:", error);
    return [];
  }
};
