var loading = document.getElementById("loading");
var resultsDiv = document.getElementById("results");

function fetchData() {
  loading.style.display = "block";
  resultsDiv.innerHTML = "";

  fetch("https://api.tvmaze.com/search/shows?q=batman")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loading.style.display = "none";

      for (var i = 0; i < data.length; i++) {
        var show = data[i].show;

        var card = document.createElement("div");
        card.className = "card";

        var image = show.image ? show.image.medium : "https://via.placeholder.com/210x295";
        var name = show.name;
        var rating = show.rating && show.rating.average ? show.rating.average : "N/A";
        var genres = show.genres.length > 0 ? show.genres.join(", ") : "N/A";

        var summary = "No description";
        if (show.summary) {
          summary = show.summary.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
        }

        card.innerHTML =
          "<img src='" + image + "' style='width:100%'>" +
          "<h3>" + name + "</h3>" +
          "<p>Rating: " + rating + "</p>" +
          "<p>Genres: " + genres + "</p>" +
          "<p>" + summary + "</p>";

        resultsDiv.appendChild(card);
      }
    })
    .catch(function () {
      loading.style.display = "none";
      resultsDiv.innerHTML = "<p>Error loading data</p>";
    });
}

document.querySelector("button").onclick = function () { };
document.getElementById("searchInput").onkeypress = function (e) {
  e.preventDefault();
};

fetchData();