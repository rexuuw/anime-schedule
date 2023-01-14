<script lang="ts">
  import ListEntry from "./ListEntry.svelte";

  export let list;
  export let watchList;
  export let listIndex;

  let date = new Date();
  let today = date.toLocaleString('en-us', { weekday: 'long' });
  console.log(today);
  
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

</script>

<div class="dayWrapper">
  <h1 class="{today === days[listIndex] ? 'today' : ''}">{days[listIndex]}</h1>
  <ul class="listWrapper">
    {#if list[listIndex].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
      <p class="listSeperator">
        <span class="watching">Watching</span>
        <span class="count">({ list[listIndex].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length })</span>
      </p>
    {/if}
    {#each list[listIndex].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1) as anime, i}
      <ListEntry anime={anime} watching={true}/>
    {/each}
    {#if list[listIndex].filter((anime) => watchList.indexOf(anime.title.userPreferred) > -1).length > 0}
      <span class="listSeperator">Not watching</span>
    {/if}
    {#each list[listIndex].filter((anime) => watchList.indexOf(anime.title.userPreferred) === -1) as anime, i}
      <ListEntry anime={anime} watching={false}/>
    {/each}
  </ul>
</div>

<style>
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