// References are obtained for the input box where users type the movie name, 
// the button they click to search, and the section where the search results will be displayed.
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsSection = document.getElementById('movie-results');

// A click event is added to the search button. When clicked, the value entered in the input box is trimmed, 
// and the function to search for movies is called.
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// A keyup event is added to detect when the "Enter" key is pressed while typing in the input box.
// This allows users to start a search without clicking the button.
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

// Handles the actual search. Sends a request to the server with the movie name and retrieves a list of results.
// If an error occurs, an error message is displayed on the page.
async function searchMovies(query) {
    try {
        const response = await fetch(`/api/search?q=${query}`);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        resultsSection.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
}

// Takes the list of movies from the search and displays them in the results section.
// If no movies are found, a message is displayed.
function displayMovies(movies) {
    resultsSection.innerHTML = '';

    if (movies.length === 0) {
        resultsSection.innerHTML = '<p>No movies found.</p>';
        return; 
    }

    // For each movie in the list, a new box is created, the title and release year are added, and it is made clickable.
    // Clicking on a movie calls another function to show the details of that movie.
    movies.forEach((movie) => {
        const resultItem = document.createElement('div');
        resultItem.textContent = `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})`;
        resultItem.addEventListener('click', () => showMovieDetails(movie.id));
        resultsSection.appendChild(resultItem);
    });
}

// Fetches more details about a specific movie from the server when a movie is clicked.
// The details are displayed in a simple popup.
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`/api/movie/${movieId}`);
        const movie = await response.json();

        alert(`
            Title: ${movie.title}
            Overview: ${movie.overview}
            Release Date: ${movie.release_date || 'Not Available'}
        `);
    } catch (error) {
        alert('Something went wrong while getting movie details.');
    }
}
