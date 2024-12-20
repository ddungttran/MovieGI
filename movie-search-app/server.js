// Load environment variables from a .env file
require('dotenv').config();

// Import necessary libraries
const express = require('express'); 
const axios = require('axios'); 
const path = require('path'); 

// Create an Express app
const app = express();
const PORT = 3000; // The port where the server will run on 3000

// Serve static files from the "public" folder 
app.use(express.static(path.join(__dirname, 'public')));

//API key and base URL
const TMDB_API_KEY = process.env.TMDB_API_KEY; // API key I stored in the .env file
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'; // Base URL for TMDB API

// Route to search for movies by name
app.get('/api/search', async (req, res) => {
    const query = req.query.q; // Get the "q" parameter from the URL (movie name)
    try {
        // Make a GET request to the TMDB API to search for movies
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: { api_key: TMDB_API_KEY, query }, // Send the API key and search query as parameters
        });
        res.json(response.data.results); // Send the list of movies back to the client
    } catch (error) {
        // If there's an error, send a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
});

// Route to get details for a specific movie by its ID
app.get('/api/movie/:id', async (req, res) => {
    const movieId = req.params.id; // Get the movie ID from the URL
    try {
        // Make a GET request to the TMDB API to get movie details
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: { 
                api_key: TMDB_API_KEY, 
                append_to_response: 'recommendations', // Include recommendations in the response
            },
        });
        res.json(response.data); // Send the movie details back to the client
    } catch (error) {
        // If there's an error, send a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
});
