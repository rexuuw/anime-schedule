import { writable } from 'svelte/store';

let watchList = JSON.parse(localStorage.getItem("watchList"));

const watchListStore = writable(watchList);

export default watchListStore;