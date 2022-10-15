import type { coverImage, title, startDate, endDate, nextAiringEpisode } from "./models";

export class anime {
  id: number;
  title: title;
  coverImage: coverImage;
  startDate: startDate;
  endDate: endDate;
  bannerImage;
  season;
  seasonYear;
  description;
  type;
  format;
  episodes;
  duration;
  genres;
  averageScore;
  popularity;
  nextAiringEpisode: nextAiringEpisode;

  constructor(title: string) {
    this.title.userPreffered = title;
  } 
}