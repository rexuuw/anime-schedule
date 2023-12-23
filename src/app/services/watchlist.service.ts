import { Injectable } from '@angular/core';
import { Anime } from '../models/anime.model';
import { BehaviorSubject } from 'rxjs';
import { AnilistService } from './anilist.service';
import { ListEntry } from '../models/listEntry.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  public _watchList = new BehaviorSubject<ListEntry[]>([]);
  private _watchList$ = this._watchList.getValue();

  constructor(private anilist: AnilistService) { }

  public async getWatchlist(animeIds: number[]) {
    let res: ListEntry[] = await this.anilist.getListProgress(animeIds);
    this.setWatchlist(res);
  }

  public setWatchlist(watchlist: ListEntry[]) {
    return this._watchList.next(watchlist);
  }

  public toggleWatchlist(anime: any, onWatchlist: boolean) {
    if (!onWatchlist) {
      this.addToWatchlist(anime);
    } else {
      this.removeFromWatchlist(anime)
    }
  }

  private async addToWatchlist(anime: Anime) {
    let watchList: ListEntry[] = this._watchList.getValue();
  
    let res: ListEntry = await this.anilist.addAnimeToList(anime.id);

    if (res) {
      watchList.push(res);
      this.setWatchlist(watchList);
    }
  }

  private async removeFromWatchlist(anime: Anime) {
    let watchList: ListEntry[] = this._watchList.getValue();
    let entryId = watchList.find(entry => entry.media.id === anime.id)?.id;
    
    if (entryId) {
      let res: boolean = await this.anilist.deleteAnimeFromList(entryId);

      if (res) {
        watchList.splice(watchList.findIndex(entry => entry.media.id === anime.id), 1);
        this.setWatchlist(watchList);
      }
    }
  }
}
