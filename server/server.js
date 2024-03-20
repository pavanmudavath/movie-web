const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors'); // Import the cors package
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

let MOVIESTORE = [];

try {
    MOVIESTORE = JSON.parse(fs.readFileSync('moviestore.json', 'utf8'));
} catch {
    MOVIESTORE = [];
}

app.post('/movies', (req, res) => {
    const movie = req.body;
    movie.id = MOVIESTORE.length + 1;
    MOVIESTORE.push(movie);
    fs.writeFileSync('moviestore.json', JSON.stringify(MOVIESTORE));
    res.json({ message: "Movie created successfully", movieId: movie.id });
});

app.put('/movies/:movieId', (req, res) => {
    const movieToUpdate = MOVIESTORE.find(movie => movie.id === parseInt(req.params.movieId));
    if (movieToUpdate) {
        Object.assign(movieToUpdate, req.body);
        fs.writeFileSync('moviestore.json', JSON.stringify(MOVIESTORE));
        res.json({ message: "Movie Updated Successfully" });
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

app.delete('/movies/:movieId', (req, res) => {
    const movieIndex = MOVIESTORE.findIndex(movie => movie.id === parseInt(req.params.movieId));
    if (movieIndex !== -1) {
        MOVIESTORE.splice(movieIndex, 1);
        fs.writeFileSync('moviestore.json', JSON.stringify(MOVIESTORE));
        res.json({ message: "Movie Deleted Successfully" });
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

app.get('/movies/:movieId', (req, res) => {
    const movie = MOVIESTORE.find(movie => movie.id === parseInt(req.params.movieId));
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

app.get('/movies', (req, res) => {
    res.json({ movies: MOVIESTORE });
});

app.listen(4000, () => console.log('Server running on port 4000'));
