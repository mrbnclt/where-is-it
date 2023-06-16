var searchButton = document.getElementById("search");
var spinner = document.getElementById("spinner");
var showList = document.getElementById("show-list");
var tmdbAttribution = document.getElementById("tmdb-attribution");
var queryText = document.getElementById("query");
queryText.focus();

queryText.addEventListener("keyup", checkIfEnter);
searchButton.addEventListener("click", search);

tmdbAttribution.src = chrome.runtime.getURL("images/tmdb.svg");
let userRegion;

fetch("https://ipinfo.io/json").then(async (response) => {
	const currentRegion = await response.json();
	const regionText = document.getElementById("region");
	const image = document.createElement("img");
	image.setAttribute("height", "24");
	image.setAttribute("width", "24");
	image.setAttribute("alt", "Flag");
	image.src = `https://flagsapi.com/${currentRegion.country}/shiny/24.png`;
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
		providerNames.classList.add("d-flex");
		providerNames.classList.add("flex-column");
		providerNames.classList.add("row-gap-1");
		if (
			providers.results[userRegion] &&
			providers.results[userRegion].flatrate
		) {
			for (const provider of providers.results[userRegion].flatrate) {
				const image = document.createElement("img");
				image.setAttribute("height", "32");
				image.setAttribute("width", "32");
				image.setAttribute("alt", provider.provider_name);
				image.setAttribute("title", provider.provider_name);
				image.src = `https://image.tmdb.org/t/p/w200${provider.logo_path}`;
				providerNames.appendChild(image);
			}
		} else {
			providerNames.style.fontSize = "14px";
			providerNames.innerHTML += "Unavailable";
		}
		item.appendChild(providerNames);
	});
}

function createList(shows) {
	showList.innerHTML = "";
	for (const show of shows) {
		if (show.media_type === "tv" || show.media_type === "movie") {
			// Show Wrapper
			const showDetails = document.createElement("div");
			showDetails.classList.add("d-flex");
			showDetails.classList.add("justify-content-between");
			showDetails.classList.add("column-gap-3");

			// Show Backdrop Image
			if (show.backdrop_path) {
				const showImage = document.createElement("img");
				showImage.setAttribute("height", "104");
				showImage.setAttribute("width", "185");
				showImage.setAttribute("alt", show.title || show.name);
				showImage.setAttribute("title", show.title || show.name);
				showImage.classList.add("float-start");
				showImage.src = `https://image.tmdb.org/t/p/w300${show.backdrop_path}`;
				showDetails.appendChild(showImage);
			}

			// Show Description Wrapper
			const showDescriptionWrapper = document.createElement("div");
			showDescriptionWrapper.classList.add("d-flex");
			showDescriptionWrapper.classList.add("flex-column");
			showDescriptionWrapper.classList.add("column-gap-3");

			// Show Title
			const showTitle = document.createElement("span");
			showTitle.classList.add("fw-bold");
			showTitle.innerHTML = show.title || show.name;
			showDescriptionWrapper.appendChild(showTitle);

			// Show Description
			const showDescription = document.createElement("p");
			showDescription.style.fontSize = "14px";
			showDescription.innerHTML = show.overview
				? show.overview
				: "This show does not have an overview in the records.";
			showDescriptionWrapper.appendChild(showDescription);

			// Show Link
			const showLink = document.createElement("a");
			showLink.innerHTML = `View ${show.title || show.name}`;
			showLink.style.fontSize = "14px";
			showLink.setAttribute("target", "_blank");
			showLink.setAttribute(
				"href",
				`https://www.themoviedb.org/${show.media_type}/${show.id}`
			);
			showDescriptionWrapper.appendChild(showLink);

			showDetails.appendChild(showDescriptionWrapper);

			const listItem = document.createElement("li");
			listItem.setAttribute("id", show.id);
			listItem.classList.add("list-group-item");
			listItem.classList.add("d-flex");
			listItem.classList.add("justify-content-between");
			listItem.classList.add("column-gap-3");
			listItem.appendChild(showDetails);

			showList.appendChild(listItem);
			getProviders(show.id, show.media_type);
		}
	}
}

function search() {
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

function checkIfEnter(e) {
	if (e.key === "Enter" || e.keyCode === 13) {
		search();
	}
}
