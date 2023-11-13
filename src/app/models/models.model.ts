export interface coverImage {
  extraLarge: string;
  large: string;
  color: string;
}

export interface title {
  romaji: string;
}

export interface startDate {
  year: number;
  month: number;
  day: number;
};

export interface endDate {
  year: number;
  month: number;
  day: number;
};


export interface nextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
};