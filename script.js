var searchButton = document.getElementById("search");
searchButton.addEventListener("click", searchClicked);

let userRegion;

fetch("https://ipinfo.io/json").then(async (response) => {
	const currentRegion = await response.json();
	const regionText = document.getElementById("region");
	var image = document.createElement("img");
	image.setAttribute("src", "images/hydrangeas.jpg");
	image.setAttribute("height", "24");
	image.setAttribute("width", "24");
	image.setAttribute("alt", "Flower");
	image.src = `https://flagsapi.com/${currentRegion.country}/shiny/64.png`;
	document.getElementById("region").appendChild(image);
	regionText.innerHTML = regionText.innerHTML + ` ${currentRegion.country}`;
	userRegion = currentRegion.country;
});

function searchClicked() {
	const queryText = document.getElementById("query");
	// TODO: Query API to return list of shows
}
