import { Component, OnInit } from '@angular/core';
import { anime } from 'src/app/models/anime.model';
import { AnilistService } from 'src/app/services/anilist.service';

@Component({
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {

  week: anime[][] = [[], [], [], [], [], [], []];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  today: string = new Date().toLocaleString('en-us', { weekday: 'long' });

  constructor(private anilist: AnilistService) { }

  async ngOnInit(): Promise<void> {
    let res: anime[] = await this.anilist.getAnime(); 
    console.log("schedule res", res);
    this.groupAnime(res);
    console.log(this.week);
  }

  sortAnime(fetchedAnime: anime[], day: number) {
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

  groupAnime(fetchedAnime: anime[]) {
    for (const item of fetchedAnime) {
      if (item.nextAiringEpisode == null) {
        continue;
      }
      let airDate = new Date(item.nextAiringEpisode.airingAt * 1000);
      let day = airDate.getDay() !== 0 ? airDate.getDay() - 1 : 6;
      
      this.week[day].push(item);
    }
  }

}
