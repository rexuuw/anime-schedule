import { Component, Input, OnInit } from '@angular/core';
import { Anime } from 'src/app/models/anime.model';
import { WatchlinkService } from 'src/app/services/watchlink.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'as-schedule-entry',
  templateUrl: './schedule-entry.component.html',
  styleUrls: ['./schedule-entry.component.scss']
})
export class ScheduleEntryComponent implements OnInit {
  @Input() anime?: Anime;
  expanded: boolean = false;
  releaseDate?: Date;
  dayDiff?: number;
  banner: string = "";
  onWatchlist: boolean = false;
  progress?: number = undefined;
  watchLink?: string;

  constructor(private watchlistService: WatchlistService, private watchlinkService: WatchlinkService) { }

  ngOnInit(): void {
    this.releaseDate = new Date((this.anime?.nextAiringEpisode?.airingAt || 0 + 3600) * 1000);
    this.dayDiff = Math.ceil(Math.abs(this.releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) - 1;

    this.banner = `background-image: url(${this.anime?.bannerImage}); background-image: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(10, 10, 10, 0.9) 70%), url(${this.anime?.bannerImage});`
    
    this.watchlistService._watchList.subscribe(watchList => {
      let index = watchList.findIndex(entry => entry.media.id === (this.anime?.id || -1));
      this.onWatchlist = index > -1;
      if (this.onWatchlist) {
        this.progress = watchList[index].progress;
      }
    })

    if (this.anime?.title.romaji) {
      this.watchlinkService.getAnimeInfo(this.anime?.title.romaji).subscribe((res: any) => {
        if (res.data) {
          this.watchlinkService.getWatchlink(res.data[0].id).subscribe((res: any) => {
            let url: string = res?.data[0]?.attributes?.url;
  
            if (url && url.includes("crunchyroll")) {
              this.watchLink = url;
            }
          })
        }
      });
      
    }
  }

  public expand() {
    this.expanded = !this.expanded;
  }

  public toggleWatchlist() {
    this.watchlistService.toggleWatchlist(this.anime, this.onWatchlist);
  }

}
