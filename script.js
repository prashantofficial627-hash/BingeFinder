var allShows = [];

var loading = document.getElementById("loading");
var resultsDiv = document.getElementById("results");
var searchInput = document.getElementById("searchInput");
var filterGenre = document.getElementById("filterGenre");
var sortBy = document.getElementById("sortBy");

function fetchData() {
  var query = searchInput.value.trim();
  if (query === "") {
    query = "batman";
  }

  loading.style.display = "block";
  resultsDiv.innerHTML = "";
  allShows = [];

  fetch("https://api.tvmaze.com/search/shows?q=" + query)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      loading.style.display = "none";

      for (var i = 0; i < data.length; i++) {
        allShows.push(data[i].show);
      }

      populateGenres();

      applyFiltersAndSort();
    })
    .catch(function () {
      loading.style.display = "none";
      resultsDiv.innerHTML = "<p>Something went wrong. Please try again.</p>";
    });
}

function populateGenres() {
  var genreSet = [];

  for (var i = 0; i < allShows.length; i++) {
    var genres = allShows[i].genres;
    for (var j = 0; j < genres.length; j++) {
      if (genreSet.indexOf(genres[j]) === -1) {
        genreSet.push(genres[j]);
      }
    }
  }

  filterGenre.innerHTML = '<option value="">All Genres</option>';

  for (var k = 0; k < genreSet.length; k++) {
    var option = document.createElement("option");
    option.value = genreSet[k];
    option.textContent = genreSet[k];
    filterGenre.appendChild(option);
  }
}

function applyFiltersAndSort() {
  var selectedGenre = filterGenre.value;
  var selectedSort = sortBy.value;

  var filtered = [];
  for (var i = 0; i < allShows.length; i++) {
    var show = allShows[i];
    if (selectedGenre === "" || show.genres.indexOf(selectedGenre) !== -1) {
      filtered.push(show);
    }
  }

  if (selectedSort === "name") {
    filtered.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (selectedSort === "rating") {
    filtered.sort(function (a, b) {
      var ratingA = a.rating && a.rating.average ? a.rating.average : 0;
      var ratingB = b.rating && b.rating.average ? b.rating.average : 0;
      return ratingB - ratingA;
    });
  }

  displayShows(filtered);
}

function displayShows(shows) {
  resultsDiv.innerHTML = "";

  if (shows.length === 0) {
    resultsDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  for (var i = 0; i < shows.length; i++) {
    var show = shows[i];

    var image = show.image ? show.image.medium : "https://via.placeholder.com/210x295";
    var name = show.name;
    var rating = show.rating && show.rating.average ? show.rating.average : "N/A";
    var genres = show.genres.length > 0 ? show.genres.join(", ") : "N/A";
    var summary = "No description available.";
    if (show.summary) {
      summary = show.summary.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
    }

    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      "<img src='" + image + "' alt='" + name + "'>" +
      "<h3>" + name + "</h3>" +
      "<p>⭐ Rating: " + rating + "</p>" +
      "<p>🎭 Genres: " + genres + "</p>" +
      "<p>" + summary + "</p>";

    resultsDiv.appendChild(card);
  }
}

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fetchData();
  }
});

filterGenre.addEventListener("change", applyFiltersAndSort);
sortBy.addEventListener("change", applyFiltersAndSort);

fetchData();