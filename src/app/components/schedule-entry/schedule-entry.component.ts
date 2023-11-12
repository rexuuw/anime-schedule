import { Component, Input, OnInit } from '@angular/core';
import { anime } from 'src/app/models/anime.model';

@Component({
  selector: 'as-schedule-entry',
  templateUrl: './schedule-entry.component.html',
  styleUrls: ['./schedule-entry.component.scss']
})
export class ScheduleEntryComponent implements OnInit {
  @Input() anime: anime | undefined = undefined;
  expanded: boolean = false;
  releaseDate?: Date;
  dayDiff?: number;
  banner: string = "";

  constructor() { }

  ngOnInit(): void {
    this.releaseDate = new Date((this.anime?.nextAiringEpisode?.airingAt || 0 + 3600) * 1000);
    this.dayDiff = Math.ceil(Math.abs(this.releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) - 1;

    this.banner = `background-image: url(${this.anime?.bannerImage}); background-image: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(10, 10, 10, 0.9) 70%), url(${this.anime?.bannerImage});`
  }

  public expand() {
    this.expanded = !this.expanded;
  }

}
