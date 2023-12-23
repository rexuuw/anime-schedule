import type { coverImage, title, startDate, endDate, nextAiringEpisode } from "./models.model";

export interface Anime {
  id: number;
  title: title;
  coverImage: coverImage;
  startDate: startDate;
  endDate: endDate;
  bannerImage: string;
  season: string;
  seasonYear: number;
  description: string;
  type: string;
  format: string;
  episodes: number;
  duration: number;
  genres: string[];
  averageScore: number;
  popularity: number;
  nextAiringEpisode: nextAiringEpisode;
}