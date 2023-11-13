import { Component, Input, OnInit } from '@angular/core';
import { anime } from 'src/app/models/anime.model';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'as-schedule-entry',
  templateUrl: './schedule-entry.component.html',
  styleUrls: ['./schedule-entry.component.scss']
})
export class ScheduleEntryComponent implements OnInit {
  @Input() anime?: anime;
  expanded: boolean = false;
  releaseDate?: Date;
  dayDiff?: number;
  banner: string = "";
  onWatchlist: boolean = false;

  constructor(private watchlistService: WatchlistService) { }

  ngOnInit(): void {
    this.releaseDate = new Date((this.anime?.nextAiringEpisode?.airingAt || 0 + 3600) * 1000);
    this.dayDiff = Math.ceil(Math.abs(this.releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) - 1;

    this.banner = `background-image: url(${this.anime?.bannerImage}); background-image: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(10, 10, 10, 0.9) 70%), url(${this.anime?.bannerImage});`
    
    this.watchlistService._watchList.subscribe(watchList => {
      this.onWatchlist = watchList.indexOf(this.anime?.title.romaji || "") > -1;
    })
  }

  public expand() {
    this.expanded = !this.expanded;
  }

  public toggleWatchlist() {
    this.watchlistService.toggleWatchlist(this.anime);
  }

}
