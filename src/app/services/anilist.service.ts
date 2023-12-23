import { Injectable } from '@angular/core';
import { Anime } from '../models/anime.model';
import { Seasons } from "../models/seasons.enum";
import { ListEntry } from '../models/listEntry.model';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AnilistService {

  private readonly url = 'https://graphql.anilist.co';  
  
  private accessToken?: string;
  private page: number = 1
  private season: string = "";
  private previousSeason: string = "";
  private year: number = 0;
  private previousYear: number = 0;
  private user?: User;
  
  constructor(private route: ActivatedRoute) {
    route.fragment.subscribe(fragment => {
      if (fragment?.includes("access_token=")) {
        // Set Bearer
        let start = fragment.indexOf("=") + 1;
        let end = fragment.indexOf("&");
        this.accessToken = fragment.slice(start, end);

        // Set authenticated user
        this.getAuthenticatedUser().then(res => {
          this.user = res;
        });
        
        localStorage.setItem("access_token", this.accessToken);
      } else {
        let accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          this.accessToken = accessToken;

          // Set authenticated user
          this.getAuthenticatedUser().then(res => {
            this.user = res;
          });
        }
      }
    })    
  }

  private handleResponse(response: any) {
    return response.json().then(function (json: any) {
        return response.ok ? json : Promise.reject(json);
    });
  }

  async getAnime() {
    this.page = 1;
    let anime: Anime[] = [];
    let res;

    const query = `
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
        perPage:150
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
    
    // Fetch atleast once and as long as there is a next page
    do {
      let options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: {
            page: this.page,
            status: 'RELEASING',
            // season: this.season,
            // seasonYear: this.year,
            format: ['TV', 'MOVIE', 'TV_SHORT']
          }
        })
      };

      res = await fetch(this.url, options)
        .then(this.handleResponse);
      
      anime = [...anime, ...res.data.Page.media]

      this.page++;
    } while (res.data.Page.pageInfo.hasNextPage && this.page < 50);

    return anime;
  }

  async getListProgress(animeIds: number[]) {
    if (!this.user || this.user?.name === '') {
      return;
    }

    this.page = 1;
    let anime: ListEntry[] = [];
    let res;

    const medialistQuery = `
  query($page:Int,$userId:Int,$userName:String,$mediaId_in:[Int]){\
    Page(page:$page, perPage:150){
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      mediaList(userId:$userId,userName:$userName,mediaId_in:$mediaId_in,status:CURRENT){
        id
        progress
        media{
          id 
          title{romaji}
          bannerImage
          status
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
  }
  `
    
    // Fetch atleast once and as long as there is a next page
    do {
      let options = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: medialistQuery,
          variables: {
            page: this.page,
            mediaId_in: animeIds,
            userName: this.user?.name,
          }
        })
      };

      res = await fetch(this.url, options)
        .then(this.handleResponse);
      
      anime = [...anime, ...res.data.Page.mediaList]

      this.page++;
    } while (res.data.Page.pageInfo.hasNextPage && this.page < 50);

    return anime;
  }

  async addAnimeToList(animeId: number): Promise<ListEntry> {
    const query = `
      mutation($mediaId: Int, $status:MediaListStatus){
        SaveMediaListEntry (mediaId: $mediaId, status: $status) {
          id
          progress
          media {
            id 
            title{romaji}
            bannerImage
            status
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
    `

    let options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          mediaId: animeId,
          status: "CURRENT"
        }
      })
    };

    let res = await fetch(this.url, options)
      .then(this.handleResponse);
    
    let listEntry: ListEntry = res.data.SaveMediaListEntry;
    return listEntry;
  }

  async deleteAnimeFromList(animeId: number): Promise<boolean> {
    const query = `
      mutation($id: Int){
        DeleteMediaListEntry (id: $id) {
          deleted
        }
      }
    `

    let options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          id: animeId,
        }
      })
    };

    let res = await fetch(this.url, options)
      .then(this.handleResponse);
    
    return res.data.DeleteMediaListEntry.deleted;
  }

  async getAuthenticatedUser(): Promise<User> {
    const query = `
      query{
        Viewer{
          id
          name
          avatar{
            medium
          }
        }
      }
    `

    let options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          search: this.accessToken
        }
      })
    };

    let res = await fetch(this.url, options)
      .then(this.handleResponse);

    return res.data.Viewer;
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
