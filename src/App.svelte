<script lang="ts">
	import ListEntry from "./components/ListEntry.svelte";
  import { item } from "./model/item";
  import { onMount, onDestroy } from "svelte";
  
  let list: item[] = [];
  let monAni = [];
  let tueAni: item[] = [];
  let wedAni: item[] = [];
  let thuAni: item[] = [];
  let friAni: item[] = [];
  let satAni: item[] = [];
  let sunAni: item[] = [];

  $: list;


  function addItem(event) {
    if(event.key = 'Enter') {

      switch (event.target.id) {
        case "mon":
          monAni = [...monAni, new item(event.target.value)];
          localStorage.setItem("monAni", JSON.stringify(monAni));
          event.target.value = '';
          break;
        case "tue":
          tueAni = [...tueAni, new item(event.target.value)];
          localStorage.setItem("tueAni", JSON.stringify(tueAni));
          event.target.value = '';
          break;
        case "wed":
          wedAni = [...wedAni, new item(event.target.value)];
          localStorage.setItem("wedAni", JSON.stringify(wedAni));
          event.target.value = '';
          break;
        case "thu":
          thuAni = [...thuAni, new item(event.target.value)];
          localStorage.setItem("thuAni", JSON.stringify(thuAni));
          event.target.value = '';
          break;
        case "fri":
          friAni = [...friAni, new item(event.target.value)];
          localStorage.setItem("friAni", JSON.stringify(friAni));
          event.target.value = '';
          break;
        case "sat":
          satAni = [...satAni, new item(event.target.value)];
          localStorage.setItem("satAni", JSON.stringify(satAni));
          event.target.value = '';
          break;
        case "sun":
          sunAni = [...sunAni, new item(event.target.value)];
          localStorage.setItem("sunAni", JSON.stringify(sunAni));
          event.target.value = '';
          break;
        default:
          break;
      }
      
    }
  }


  onMount(() => {
    monAni = JSON.parse(localStorage.getItem("monAni"));
    if (monAni == null) {
      monAni = [];
    }

    tueAni = JSON.parse(localStorage.getItem("tueAni"));
    if (tueAni == null) {
      tueAni = [];
    }

    wedAni = JSON.parse(localStorage.getItem("wedAni"));
    if (wedAni == null) {
      wedAni = [];
    }

    thuAni = JSON.parse(localStorage.getItem("thuAni"));
    if (thuAni == null) {
      thuAni = [];
    }

    friAni = JSON.parse(localStorage.getItem("friAni"));
    if (friAni == null) {
      friAni = [];
    }

    satAni = JSON.parse(localStorage.getItem("satAni"));
    if (satAni == null) {
      satAni = [];
    }

    sunAni = JSON.parse(localStorage.getItem("sunAni"));
    if (sunAni == null) {
      sunAni = [];
    }
  });

  
</script>

<main>

  <section class="weekWrapper">
    <div class="dayWrapper">
      <h1>Monday</h1>
      <input type="text" placeholder="Enter title..." id="mon" on:change={addItem}>
      <ul class="listWrapper">
        {#each monAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={monAni} day="mon"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Tuesday</h1>
      <input type="text" placeholder="Enter title..." id="tue" on:change={addItem}>
      <ul class="listWrapper">
        {#each tueAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={tueAni} day="tue"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Wednesday</h1>
      <input type="text" placeholder="Enter title..." id="wed" on:change={addItem}>
      <ul class="listWrapper">
        {#each wedAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={wedAni} day="wed"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Thursday</h1>
      <input type="text" placeholder="Enter title..." id="thu" on:change={addItem}>
      <ul class="listWrapper">
        {#each thuAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={thuAni} day="thu"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Friday</h1>
      <input type="text" placeholder="Enter title..." id="fri" on:change={addItem}>
      <ul class="listWrapper">
        {#each friAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={friAni} day="fri"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Saturday</h1>
      <input type="text" placeholder="Enter title..." id="sat" on:change={addItem}>
      <ul class="listWrapper">
        {#each satAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={satAni} day="sat"/>
        {/each}
      </ul>
    </div>
    <div class="dayWrapper">
      <h1>Sunday</h1>
      <input type="text" placeholder="Enter title..." id="sun" on:change={addItem}>
      <ul class="listWrapper">
        {#each sunAni as anime, i}
          <ListEntry item={anime} index={i} bind:list={sunAni} day="sun"/>
        {/each}
      </ul>
    </div>
  </section>
</main>

<style>
  main {
    /* margin-right: auto;
    margin-left: auto;
    max-width: 1000px; */
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

  .dayWrapper input {
    width: 95%;
    margin-bottom: 10px;
    padding: 0.6em;
    font-size: 1em;
    color: #fff;
    outline: none;
    border: 1px solid rgb(167, 167, 167);
    border-radius: 5px;
    box-shadow: inset 2px 2px 5px rgb(0, 0, 0, 0.35);
    background-color: transparent;
    transition: all 0.3s;
  }

  .dayWrapper input:focus {
    border: 1px solid #fff;
    box-shadow: 2px 4px 4px rgba(94, 94, 94, 0.5);
  }

  .listWrapper {
    width: 100%;
    padding-inline: 7px;
  }

</style>