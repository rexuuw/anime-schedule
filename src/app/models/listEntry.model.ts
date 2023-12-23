import { Anime } from "./anime.model";

export interface ListEntry {
  id: number;
  progress: number;
  media: Anime
}