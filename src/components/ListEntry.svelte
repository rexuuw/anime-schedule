<script lang="ts">
  export let item;
  export let index;
  export let list;
  export let day;

  let link : string = item.title.toLowerCase().replace(/\s+/g, "-");

  function deleteItem () {
    list = [...list.filter(i => i != list[index])];
    localStorage.setItem(day + "Ani", JSON.stringify(list));
  }
</script>

<main>
  <button class="dragButton">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  </button>
  <!-- <img src="https://cdn.myanimelist.net/images/anime/1141/102223.jpg" alt="#"/> -->
  <div class="title">
    <a href="https://animixplay.to/v1/{link}">
      <h1>{item.title}</h1>
    </a>
  </div>
  <button class="delete" on:click={deleteItem}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  </button>
</main>

<style>
  main {
    height: 100px;
    margin-bottom: 7px;
    display: flex;
    align-items: center;

    border-radius: 5px;
    color: #fff;
    background-color: rgb(46, 46, 46);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .dragButton {
    width: 50px;
    height: 100%;

    background-color: transparent;
    outline: none;
    border: none;
    cursor: grab;
    transition: background-color 0.3s;
  }

  .dragButton:hover {
    background-color: rgb(61, 61, 61);
  }

  .dragButton:active {
    cursor: grabbing;
  }

  .title {
    margin-left: 15px;
    width: 100%;
  }

  .title h1 {
    margin: 0 0 10px 0;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #fff;
  }

  .delete {
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
  }

</style>