import { writable } from 'svelte/store';

// Check if WatchList exists in localStorage, if it doesn't create it   
if (!localStorage.getItem("watchList")) {
  localStorage.setItem("watchList", JSON.stringify([]));
} 
let watchList = JSON.parse(localStorage.getItem("watchList"));

const watchListStore = writable(watchList);

export default watchListStore;