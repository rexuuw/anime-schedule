import { Injectable } from '@angular/core';
import { anime } from '../models/anime.model';
import { Seasons } from "../models/seasons.enum";

@Injectable({
  providedIn: 'root'
})
export class AnilistService {

  private readonly url = 'https://graphql.anilist.co'
  private readonly query = `
  query(
    $page:Int = 10 
    $id:Int 
    $type:MediaType 
    $isAdult:Boolean = false 
    $search:String 
    $format:[MediaFormat]
    $status:MediaStatus 
    $countryOfOrigin:CountryCode 
    $source:MediaSource 
    $season:MediaSeason 
    $seasonYear:Int 
    $year:String 
    $onList:Boolean 
    $yearLesser:FuzzyDateInt 
    $yearGreater:FuzzyDateInt 
    $episodeLesser:Int 
    $episodeGreater:Int 
    $durationLesser:Int 
    $durationGreater:Int 
    $chapterLesser:Int 
    $chapterGreater:Int 
    $volumeLesser:Int 
    $volumeGreater:Int 
    $licensedBy:[Int]
    $isLicensed:Boolean 
    $genres:[String]
    $excludedGenres:[String]
    $tags:[String]
    $excludedTags:[String]
    $minimumTagRank:Int 
    $sort:[MediaSort]=[POPULARITY_DESC,SCORE_DESC])
    {
      Page(
        page:$page,
        perPage:100
        )
        {
          pageInfo
          {
            total perPage currentPage lastPage hasNextPage
          }
          media(
            id:$id 
            type:$type 
            season:$season 
            format_in:$format 
            status:$status 
            countryOfOrigin:$countryOfOrigin 
            source:$source 
            search:$search 
            onList:$onList 
            seasonYear:$seasonYear 
            startDate_like:$year 
            startDate_lesser:$yearLesser 
            startDate_greater:$yearGreater 
            episodes_lesser:$episodeLesser 
            episodes_greater:$episodeGreater 
            duration_lesser:$durationLesser 
            duration_greater:$durationGreater 
            chapters_lesser:$chapterLesser 
            chapters_greater:$chapterGreater 
            volumes_lesser:$volumeLesser 
            volumes_greater:$volumeGreater 
            licensedById_in:$licensedBy 
            isLicensed:$isLicensed 
          genre_in:$genres 
          genre_not_in:$excludedGenres 
          tag_in:$tags 
          tag_not_in:$excludedTags 
          minimumTagRank:$minimumTagRank 
          sort:$sort 
          isAdult:$isAdult)
          {
            id 
            title{romaji}
            coverImage{extraLarge large color}
            startDate{year month day}
            endDate{year month day}
            bannerImage 
            season 
            seasonYear 
            description 
            type 
            format
            episodes 
            duration 
            genres 
            averageScore 
            popularity 
            nextAiringEpisode{airingAt timeUntilAiring episode}
          }
        }
      }
      `;
  
  private page: number = 1
  private season: string = "";
  private previousSeason: string = "";
  private year: number = 0;
  private previousYear: number = 0;
  
  constructor() { }

  private handleResponse(response: any) {
    return response.json().then(function (json: any) {
        return response.ok ? json : Promise.reject(json);
    });
  }

  async getAnime() {
    this.getSeasons();

    let anime: anime[] = [];
    let res;
    
    // Fetch atleast once and as long as there is a next page
    do {
      let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: this.query,
          variables: {
            page: this.page,
            season: this.season,
            seasonYear: this.year,
            format: ['TV', 'MOVIE', 'TV_SHORT']
          }
        })
      };

      res = await fetch(this.url, options)
        .then(this.handleResponse);
      
      anime = [...anime, ...res.data.Page.media]

      this.page++;
    } while (res.data.Page.pageInfo.hasNextPage && this.page < 25);

    this.page = 1;

    // Fetch for previous season
    do {
      let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: this.query,
          variables: {
            page: this.page,
            season: this.previousSeason,
            seasonYear: this.previousYear
          }
        })
      };

      res = await fetch(this.url, options)
        .then(this.handleResponse);
      
      anime = [...anime, ...res.data.Page.media]

      this.page++;
    } while (res.data.Page.pageInfo.hasNextPage && this.page < 25);

    return anime;
  }

  private getSeasons() {
    let now = new Date();
    let season = Math.floor((now.getMonth() / 12 * 4)) % 4;

    this.year = now.getFullYear();
    this.previousYear = (season === 0) ? now.getFullYear() - 1 : now.getFullYear();
    this.season = Seasons[season];
    this.previousSeason = Seasons[(season === 0) ? 3 : season - 1];
  }
}
