<script lang="ts">
	import ListEntry from "./components/ListEntry.svelte";
  import type { anime } from "./model/anime";
  import { onMount, onDestroy } from "svelte";
  import watchListStore from "./stores/watchList";
  
  let watchList: string[];
  
  watchListStore.subscribe(data => {
    watchList = data;    
  })

  let monAni: anime[] = [];
  let tueAni: anime[] = [];
  let wedAni: anime[] = [];
  let thuAni: anime[] = [];
  let friAni: anime[] = [];
  let satAni: anime[] = [];
  let sunAni: anime[] = [];
  let list = [sunAni, monAni, tueAni, wedAni, thuAni, friAni, satAni];

  let date = new Date();
  let today = date.getDay();

  $: list;

  /**
   * Filters the given array by the given day of the week and sorts the resulting array by airing date
   * @param fetchedAnime - The array of shows
   * @param day - The day of the week for which should be filtered
   */
  function sortAnime(fetchedAnime, day) {
    fetchedAnime = fetchedAnime.filter(item => {
      try {
        let airDate = new Date(item.nextAiringEpisode.airingAt * 1000);
        return airDate.getDay() === day;
      } catch (error) {
        console.error("An error occurred while sorting the following item: \n", item, "\n", error);
        return false;
      }
    })
    return fetchedAnime.sort(function(a, b) {
      return new Date(a.nextAiringEpisode.airingAt).getTime() - new Date(b.nextAiringEpisode.airingAt).getTime()
    })
  }

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData(data) {
    let fetchedAnime = data.data.Page.media;

    for (let i = 0; i < list.length; i++) {
      list[i] = sortAnime(fetchedAnime, i);
    }

    console.log("Season:", variables.season, variables.seasonYear, "\n", list);
    console.log("WatchList \n", watchList);
  }

  function handleError(error) {
    alert('Error, check console');
    console.error(error);
  }

  var query = `
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
            title{userPreferred}
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

  // Define our query variables and values that will be used in the query request
  var variables = {
    page: 1,
    season: "WINTER",
    seasonYear: 2023,
    format: "TV",
    type: "ANIME"
  };

  // Define the config we'll need for our Api request
  var url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };


  onMount(() => {
    // Make the HTTP Api request
    fetch(url, options).then(handleResponse)
      .then(handleData)
      .catch(handleError);
  });
  
</script>

<main>

  <section class="weekWrapper">
    <div class="dayWrapper">
      <h1 class="{today === 1 ? 'today' : ''}">Monday</h1>
      <ul class="listWrapper">
        {#if list[1].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[1].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[1].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[1].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[1].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 2 ? 'today' : ''}">Tuesday</h1>
      <ul class="listWrapper">
        {#if list[2].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1). length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[2].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[2].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[2].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1). length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[2].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 3 ? 'today' : ''}">Wednesday</h1>
      <ul class="listWrapper">
        {#if list[3].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[3].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[3].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[3].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[3].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 4 ? 'today' : ''}">Thursday</h1>
      <ul class="listWrapper">
        {#if list[4].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[4].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[4].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[4].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[4].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 5 ? 'today' : ''}">Friday</h1>
      <ul class="listWrapper">
        {#if list[5].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[5].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[5].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[5].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[5].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 6 ? 'today' : ''}">Saturday</h1>
      <ul class="listWrapper">
        {#if list[6].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[6].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[6].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[6].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">Not watching</span>
        {/if}
        {#each list[6].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1 class="{today === 0 ? 'today' : ''}">Sunday</h1>
      <ul class="listWrapper">
        {#if list[0].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <p class="listSeperator">
            <span class="watching">Watching</span>
            <span class="count">({ list[0].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
          </p>
        {/if}
        {#each list[0].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
          <ListEntry anime={anime} watching={true}/>
        {/each}
        {#if list[0].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
          <span class="listSeperator">
            Not watching
          </span>
        {/if}
        {#each list[0].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
          <ListEntry anime={anime} watching={false}/>
        {/each}
      </ul>
    </div>
  </section>
</main>

<style>
  main {
    height: 100%;
  }

  .weekWrapper {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .dayWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(27, 27, 27);
  }

  .listWrapper {
    width: 100%;
    margin-top: 0;
    padding-inline: 7px;
  }

  .today {
    color: rgb(206, 1, 103);
  }

  .listSeperator {
    width: 100%;
    padding: 0.5em;
    margin-bottom: 7px;
    display: block;
    border-radius: 10px;
    background-color: rgba(206, 1, 104, 0.15);
  }

  .listSeperator .watching {
    font-weight: bold;
  }

  .listSeperator .count {
    opacity: 0.5;
  }

</style>
