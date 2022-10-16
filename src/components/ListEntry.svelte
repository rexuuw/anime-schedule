<script lang="ts">
    import type { anime } from "../model/anime";

  export let anime;
  export let index;
  export let list;
  export let day;

  let today = new Date();
  let releaseDate = new Date((anime.nextAiringEpisode.airingAt + 3600) * 1000 );
  let dayDiff = Math.ceil(Math.abs(releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) - 1;

  let progress = (anime.nextAiringEpisode.episode - 1) / anime.episodes * 100;

  // let link : string = anime.title.userPreffered.toLowerCase().replace(/\s+/g, "-");

  function deleteItem () {
    list = [...list.filter(i => i != list[index])];
    localStorage.setItem(day + "Ani", JSON.stringify(list));
  }
</script>

<main >
  <div class="background" style="background-image: url({anime.bannerImage}); background-image: linear-gradient(-90deg, rgba(46, 46, 46, 0.5), rgba(10, 10, 10, 0.9) 70%), url({anime.bannerImage});">
    <button class="dragButton">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>      
    </button>
    <img src={anime.coverImage.large} alt="#"/>
    <div class="title">
        <h1>{anime.title.userPreferred}</h1>
    </div>
    <!-- <button class="delete" on:click={deleteItem}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    </button> -->
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
        <p>Releasing: {releaseDate.toLocaleString('de-DE', { timeZone: 'CET' })} -> in {dayDiff} Days</p>
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

  main:focus-within {
    max-height: 1000px;
  }

  .dragButton svg {
    transition: transform 0.15s;
  }

  main:focus-within .dragButton svg {
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

    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .dragButton:hover {
    background-color: rgb(61, 61, 61);
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

  /* .delete {
    height: 50px;
    width: 60px;
    position: relative;
    left: 100px;
    margin-right: 15px;
    padding: 0;

    outline: none;
    border: none;
    border-radius: 5px;
    background-color: rgb(131, 15, 0);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);

    visibility: hidden;
    opacity: 0;
    transform: scale(0.1);
    transition: all 0.3s;
  }

  .delete svg {
    transition: all 0.3s;
  }

  .delete:hover {
    background-color: rgb(78, 9, 0);
    cursor: pointer;
  }

  .delete:hover svg {
    fill: rgb(139, 139, 139);
  }

  main:hover .delete {
    left: 0;
    transform: scale(1);
    visibility: visible;
    opacity: 1;
  } */

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
    border: 1px solid rgb(233, 128, 7);
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