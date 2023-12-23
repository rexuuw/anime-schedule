import { Component, OnInit } from '@angular/core';
import { Anime } from 'src/app/models/anime.model';
import { ListEntry } from 'src/app/models/listEntry.model';
import { AnilistService } from 'src/app/services/anilist.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {

  week: Anime[][] = [[], [], [], [], [], [], []];
  weekNotOnWatchlist: Anime[][] = [[], [], [], [], [], [], []];
  weekOnWatchlist: Anime[][] = [[], [], [], [], [], [], []];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  today: string = new Date().toLocaleString('en-us', { weekday: 'long' });
  watchlist: ListEntry[] = [];

  constructor(private anilist: AnilistService, private watchlistService: WatchlistService) { }

  async ngOnInit(): Promise<void> {
    let res: Anime[] = await this.anilist.getAnime(); 
    console.log("schedule res", res);
    this.groupAnime(res);
    console.log(this.week);
    
    this.watchlistService.getWatchlist(res.map(entry => entry.id));

    this.watchlistService._watchList.subscribe(watchList => {
      this.watchlist = watchList;
      console.log("wl", this.watchlist);
      this.groupByWatchlist(watchList);
    });
  }

  sortAnime(fetchedAnime: Anime[], day: number) {
    fetchedAnime = fetchedAnime.filter(item => {
      try {
        if (item.nextAiringEpisode == null) {
          return false;
        }

        let airDate = new Date(item.nextAiringEpisode.airingAt * 1000);

        // with the previous solution the week starts on sunday
        // this conditional prevents that
        if (airDate.getDay() !== 0) {
          return airDate.getDay() - 1 === day;
        } else {
          return day === 6; // only return true when filtering for sunday
        }
      } catch (error) {
        console.error("An error occurred while sorting the following item: \n", item, "\n", error);
        return false;
      }
    })
    return fetchedAnime.sort(function(a, b) {
      return new Date(a.nextAiringEpisode.airingAt).getTime() - new Date(b.nextAiringEpisode.airingAt).getTime()
    })
  }

  groupAnime(fetchedAnime: Anime[]) {
    for (const item of fetchedAnime) {
      if (item.nextAiringEpisode == null) {
        continue;
      }
      let airDate = new Date(item.nextAiringEpisode.airingAt * 1000);
      let day = airDate.getDay() !== 0 ? airDate.getDay() - 1 : 6;
      
      this.week[day].push(item);
    }

    // Sort by Airing time
    for (let i = 0; i < this.week.length; i++) {
      this.week[i].sort((a, b) => new Date(a.nextAiringEpisode.airingAt).getTime() - new Date(b.nextAiringEpisode.airingAt).getTime());
    }

    this.groupByWatchlist(this.watchlist);
  }

  groupByWatchlist(watchlist: ListEntry[]) {
    for (let i = 0; i < this.week.length; i++) {
      this.weekOnWatchlist[i] = this.week[i].filter(anime => watchlist.findIndex(entry => entry.media.id === anime.id) > -1);
      this.weekNotOnWatchlist[i] = this.week[i].filter(anime => watchlist.findIndex(entry => entry.media.id === anime.id) === -1);
    }
  }

  openSeries(index: number) {
    let links = document.querySelectorAll<HTMLElement>('.onList' + index + ' main div.background div.title a');
    console.log(links)
    
    links.forEach(link => {
      link.click();
    });
  }

}
