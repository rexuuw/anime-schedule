import { Injectable } from '@angular/core';
import { anime } from '../models/anime.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  public _watchList = new BehaviorSubject<string[]>(JSON.parse(localStorage.getItem("watchList") || ""));
  private _watchList$ = this._watchList.getValue();

  constructor() { }

  private getWatchlist() {
    if (!localStorage.getItem("watchList")) {
      localStorage.setItem("watchList", JSON.stringify([]));
    }

    this.setWatchlist(JSON.parse(localStorage.getItem("watchList") || ""));
  }

  public setWatchlist(watchlist: string[]) {
    return this._watchList.next(watchlist);
  }

  public toggleWatchlist(anime: any) {
    this.getWatchlist();

    if (this._watchList$.indexOf(anime.title.romaji) === -1) {
      this.addToWatchlist(anime);
    } else {
      this.removeFromWatchlist(anime)
    }
  }

  private addToWatchlist(anime: anime) {
    let watchList: string[] = this._watchList$;

    watchList.push(anime.title.romaji);
    this.setWatchlist(watchList);

    localStorage.setItem("watchList", JSON.stringify(watchList));
  }

  private removeFromWatchlist(anime: anime) {
    let watchList: string[] = this._watchList$;
    
    watchList.splice(watchList.indexOf(anime.title.romaji), 1);
    this.setWatchlist(watchList);
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }
}
