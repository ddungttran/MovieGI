require('dotenv').config();

// Importing the necessary libraries: Express for the server, Axios for API requests, 
// and Path for managing file paths.
const express = require('express'); 
const axios = require('axios'); 
const path = require('path'); 

// Setting up the Express application and defining the port.
const app = express();
const PORT = 3000; 

// Configuring the application to serve static files from the "public" folder.
app.use(express.static(path.join(__dirname, 'public')));

// Loading the TMDB API key from the environment variables and defining the base URL for the API.
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Defining a route to search for movies. When a request with a query is made,
// the TMDB API is used to find matching movies, and the results are sent back.
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: { api_key: TMDB_API_KEY, query },
        });
        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Defining a route to get the details of a specific movie using its ID, along with recommendations for similar movies.
// The movie details are sent back to be displayed.
app.get('/api/movie/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: { 
                api_key: TMDB_API_KEY, 
                append_to_response: 'recommendations',
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Starting the server and logging the server URL for access.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
