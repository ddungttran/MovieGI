require('dotenv').config();

// First, I import the libraries I need: Express to set up the server, Axios to handle API requests, 
// and Path to manage file paths.
const express = require('express'); 
const axios = require('axios'); 
const path = require('path'); 

// I set up an Express application and decide that it will run on port 3000.
const app = express();
const PORT = 3000; 

// I make sure that any static files (like HTML, CSS, or JavaScript) from the "public" folder can be served.
app.use(express.static(path.join(__dirname, 'public')));

// Next, I grab my TMDB API key from the environment variables and define the base URL for the API.
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Here, I create a route that searches for movies. When someone makes a request with a query,
// I use the TMDB API to find movies that match the query and send the results back.
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

// This route gets the details of a specific movie using its ID. I also include recommendations for similar movies.
// I send the movie details back so they can be displayed.
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

// Finally, I start the server and make sure it listens on the port I defined earlier. 
// I also log the server URL so I know where to access it.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
