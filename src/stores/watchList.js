import { writable } from 'svelte/store';

let lsWatchList = JSON.parse(localStorage.getItem("watchList"));

const watchList = writable(lsWatchList);

export default watchList;