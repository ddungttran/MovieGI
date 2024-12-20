// I start by getting references to the input box where users type the movie name, 
// the button they click to search, and the section where I will display the search results.
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsSection = document.getElementById('movie-results');

// Here, I listen for a click event on the search button. When it’s clicked,
// I take the value entered in the input box, trim any extra spaces, and call the function to search for movies.
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// I also listen for the "Enter" key being pressed while the user is typing in the input box.
// This way, users can start a search without needing to click the button.
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

// This is the function where I handle the actual search. I send a request to my server with the movie name,
// then get back a list of results. If something goes wrong, I show an error message on the page.
async function searchMovies(query) {
    try {
        const response = await fetch(`/api/search?q=${query}`);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        resultsSection.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
}

// In this function I take the list of movies from the search and display them in the results section.
// If there are no movies, I show a message saying nothing was found.
function displayMovies(movies) {
    resultsSection.innerHTML = '';

    if (movies.length === 0) {
        resultsSection.innerHTML = '<p>No movies found.</p>';
        return; 
    }

    // For each movie in the list, I create a new box, add the title and release year, and make it clickable.
    // When clicked, it will call another function to show the details of that movie.
    movies.forEach((movie) => {
        const resultItem = document.createElement('div');
        resultItem.textContent = `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})`;
        resultItem.addEventListener('click', () => showMovieDetails(movie.id));
        resultsSection.appendChild(resultItem);
    });
}

// When a user clicks on a movie, I fetch more details about that specific movie from the server.
// Then, I display those details in a simple popup.
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
