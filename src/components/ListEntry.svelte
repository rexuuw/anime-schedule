<script lang="ts">
  import watchListStore from "../stores/watchList";

  export let anime;
  export let watching;
  let expanded : boolean = false;

  let today = new Date();
  let releaseDate = new Date((anime.nextAiringEpisode.airingAt + 3600) * 1000 );
  let dayDiff = Math.ceil(Math.abs(releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) - 1;

  let progress = (anime.nextAiringEpisode.episode - 1) / anime.episodes * 100;

  function addToWatchlist() {
    let watchList : string[] = JSON.parse(localStorage.getItem("watchList")) || [];
    if (watchList.indexOf(anime.title.userPreferred) === -1) {
      watchList.push(anime.title.userPreferred);
      watchListStore.update(watchList => {
        return [...watchList, anime.title.userPreferred]
      })
    }
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }

  function deleteFromWatchList() {    
    let watchList : string[] = JSON.parse(localStorage.getItem("watchList")) || [];
    watchList.splice(watchList.indexOf(anime.title.userPreferred));
    watchList.slice
    localStorage.setItem("watchList", JSON.stringify(watchList));

    watchListStore.update(watchList => {
      //watchList.splice(watchList.indexOf(anime.title.userPreferred));
      
      return watchList.filter(title => title !== anime.title.userPreferred);
    })
  }
</script>

<main class={ expanded ? "expanded" : "" }>
  <div class="background" style="background-image: url({anime.bannerImage}); background-image: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(10, 10, 10, 0.9) 70%), url({anime.bannerImage});">
    <button class="dragButton" on:click={ () => { expanded = !expanded } }>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>      
    </button>
    <img src={anime.coverImage.large} alt="#"/>
    <div class="title">
        <h1>{anime.title.userPreferred}</h1>
    </div>
    <button class="dragButton" on:click={() => {
      if(!watching) {
        addToWatchlist()
      } else {
        deleteFromWatchList()
      }}}>
      <span>
        {#if (!watching)}
          <span>+</span>
        {:else}
          -
        {/if}
      </span>
    </button>
  </div>
  <div class="progress">
    <div class="progressbar" style="width: {progress}%;"> </div>
  </div>
  <div class="information">
    <span class="score">
      <p>{anime.averageScore || "?"} / 100</p>
      <p>Score</p>
    </span>
    <span class="episodes">
      <p>{anime.nextAiringEpisode.episode - 1} / {anime.episodes || "?"}</p>
      <p>Episodes</p>
    </span>
    <span class="genres">
      {#each anime.genres as genre}
        <p class="genre">{genre}</p>
      {/each}
    </span>
    <span class="descr">
      {#if anime.nextAiringEpisode.episode === 1}
        <p>Releasing: {releaseDate.toLocaleString('de-DE', { timeZone: 'CET', hour: '2-digit', minute: "2-digit"})} -> in {dayDiff} Days</p>
      {:else}
        <p>Airing: {releaseDate.toLocaleString('de-DE', {hour: '2-digit', minute: "2-digit"})}</p>
      {/if}
      {@html anime.description || ""}
    </span>
  </div>
</main>

<style>
  main {
    max-height: 100px;
    margin-bottom: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;

    border-radius: 5px;
    color: #fff;
    background-color: rgb(14, 14, 14);
    
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    transition: max-height 0.3s;
  }

  .expanded {
    max-height: 1000px;
  }

  .dragButton svg {
    transition: transform 0.15s;
  }

  .expanded .dragButton svg {
    transform: rotate(90deg);
  }

  .background {
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 5px;

    /* background: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(14, 14, 14, 0.9)); */
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .dragButton {
    width: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: transparent;
    color: #fff;
    font-size: 1.5em;
    outline: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .dragButton:hover {
    /* background-color: rgba(206, 1, 103, 0.45); */
    background-color: rgba(255, 255, 255, 0.6);
  }

  img {
    max-height: 100%;
    border-radius: 3px;
  }

  .title {
    margin-left: 15px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .title h1 {
    margin: 0 0 10px 0;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #fff;
  }

  .progress {
    width: 100%;
    height: 10px;
    background-color: rgb(61, 61, 61);
  }

  .progressbar {
    height: 100%;
    width: 10%;
    background-color: rgb(35, 172, 35);
  }

  .information {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.3em;
  }

  .information span p {
    margin-block: 0;
  }

  .score {
    margin: 10px;
    margin-inline: auto;
    grid-row: 1;
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .score > p:last-of-type {
    opacity: 0.5;
  }

  .episodes {
    margin: 10px;
    margin-inline: auto;
    grid-row: 1;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .episodes p:last-of-type {
    opacity: 0.5;
  }

  .genres {
    height: 100%;
    grid-row: 2;
    grid-column: span 2;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
  }

  .genre {
    height: 1.5em;
    padding-inline: 0.5rem;
    padding-block: 0 1px;
    border: 1px solid rgb(206, 1, 103);
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .descr {
    margin: 10px;
    grid-row: 3;
    grid-column: span 2;
    display: flex;
    flex-direction: column;
  }

  .descr p {
    opacity: 0.5;
    margin-inline: auto;
    margin-bottom: 10px !important;
  }

</style>