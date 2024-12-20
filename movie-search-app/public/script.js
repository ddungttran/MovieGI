// Get the search input box, search button, and the section where results will appear
const searchInput = document.getElementById('searchInput'); // The box where the user types the movie name
const searchButton = document.getElementById('searchButton'); // The button the user clicks to search
const resultsSection = document.getElementById('movie-results'); // Where the movie list will show up

// When the user clicks the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim(); // Get the movie name the user typed, removing extra spaces
    if (query) { // If the user typed something
        searchMovies(query); // Call the function to search for movies
    }
});

// When the user presses the "Enter" key in the input box
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') { // Check if the key pressed was "Enter"
        const query = searchInput.value.trim(); // Get the movie name the user typed
        if (query) { // If the user typed something
            searchMovies(query); // Call the function to search for movies
        }
    }
});

// Function to search for movies using the movie name
async function searchMovies(query) {
    try {
        // Make a request to the server to search for movies
        const response = await fetch(`/api/search?q=${query}`);
        const movies = await response.json(); // Get the response as a list of movies
        displayMovies(movies); // Call the function to show the movies on the screen
    } catch (error) {
        // If there's an error show a message on the page
        resultsSection.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
}

// Function to show the list of movies on the page
function displayMovies(movies) {
    resultsSection.innerHTML = ''; // Clear any previous results

    if (movies.length === 0) { // If no movies were found
        resultsSection.innerHTML = '<p>No movies found.</p>'; // Show "no movies found"
        return; 
    }

    // For each movie in the list
    movies.forEach((movie) => {
        const resultItem = document.createElement('div'); // Create a new box for the movie
        resultItem.textContent = `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})`; // Add the movie title and year
        resultItem.addEventListener('click', () => showMovieDetails(movie.id)); // When clicked, show movie details
        resultsSection.appendChild(resultItem); // Add the movie box to the results section
    });
}

// Function to show details of a specific movie
async function showMovieDetails(movieId) {
    try {
        // Make a request to the server to get details about this movie
        const response = await fetch(`/api/movie/${movieId}`);
        const movie = await response.json(); // Get the movie details

        // Show the details in a popup
        alert(`
            Title: ${movie.title}
            Overview: ${movie.overview}
            Release Date: ${movie.release_date || 'Not Available'}
        `);
    } catch (error) {
        // If there's an error, show an error message
        alert('Something went wrong while getting movie details.');
    }
}
