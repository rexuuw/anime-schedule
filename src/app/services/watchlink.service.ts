import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WatchlinkService {

  constructor(private http: HttpClient) { }

  getAnimeInfo(title: string) {
    return this.http.get(`https://kitsu.io/api/edge/anime?filter[text]=${title}`);
  }

  getWatchlink(id: number) {
    return this.http.get(`https://kitsu.io/api/edge/anime/${id}/streaming-links`)
  }

}
