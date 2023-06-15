var searchButton = document.getElementById("search");
var spinner = document.getElementById("spinner");
var showList = document.getElementById("show-list");
var tmdbAttribution = document.getElementById("tmdb-attribution");
tmdbAttribution.src = chrome.runtime.getURL("images/tmdb.svg");

searchButton.addEventListener("click", searchClicked);
let userRegion;

fetch("https://ipinfo.io/json").then(async (response) => {
	const currentRegion = await response.json();
	const regionText = document.getElementById("region");
	const image = document.createElement("img");
	image.setAttribute("height", "24");
	image.setAttribute("width", "24");
	image.setAttribute("alt", "Flag");
	image.src = `https://flagsapi.com/${currentRegion.country}/shiny/64.png`;
	document.getElementById("region").appendChild(image);
	regionText.innerHTML = regionText.innerHTML + ` ${currentRegion.country}`;
	userRegion = currentRegion.country;
});

function getProviders(id, media_type) {
	fetch(
		`https://asia-southeast1-where-is-it-389903.cloudfunctions.net/providers?media_type=${media_type}&show_id=${id}`
	).then(async (response) => {
		const providers = await response.json();
		const item = document.getElementById(id);
		const providerNames = document.createElement("span");
		if (
			providers.results[userRegion] &&
			providers.results[userRegion].flatrate
		) {
			for (const provider of providers.results[userRegion].flatrate) {
				const image = document.createElement("img");
				image.setAttribute("height", "24");
				image.setAttribute("width", "24");
				image.setAttribute("alt", provider.provider_name);
				image.setAttribute("title", provider.provider_name);
				image.src = `https://image.tmdb.org/t/p/w200${provider.logo_path}`;
				providerNames.appendChild(image);
			}
		} else {
			providerNames.innerHTML += "Unavailable in your region";
		}
		item.appendChild(providerNames);
	});
}

function createList(shows) {
	showList.innerHTML = "";
	for (const show of shows) {
		if (show.media_type === "tv" || show.media_type === "movie") {
			const showTitle = document.createElement("span");
			showTitle.classList.add("fw-bold");
			showTitle.innerHTML = show.title || show.name;

			const listItem = document.createElement("li");
			listItem.setAttribute("id", show.id);
			listItem.classList.add("list-group-item");
			listItem.classList.add("d-flex");
			listItem.classList.add("justify-content-between");
			listItem.classList.add("column-gap-3");
			listItem.appendChild(showTitle);

			showList.appendChild(listItem);
			getProviders(show.id, show.media_type);
		}
	}
}

function searchClicked() {
	const queryText = document.getElementById("query");
	spinner.removeAttribute("hidden");
	fetch(
		`https://asia-southeast1-where-is-it-389903.cloudfunctions.net/shows?show=${queryText.value}`,
		{ headers: {} }
	).then(async (response) => {
		const shows = await response.json();
		createList(shows.results);
		spinner.setAttribute("hidden", "hidden");
	});
}
