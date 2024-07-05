import React, { useEffect, useState, ChangeEvent } from "react";
import "./App.css";
import SearchIcon from "./assets/search.svg";
import MovieCard from "./MovieCard";

const OMDB_KEY: string = import.meta.env.VITE_OMDB_API_KEY;
const API_URL: string = `http://omdbapi.com?apikey=${OMDB_KEY}`;

interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const searchMovies = async (title: string) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        if (data && data.Search) {
            setMovies(data.Search);
        } else {
            setMovies([]);
        }
    };

    const debouncedSearchMovies = (title: string) => {
        const debounceTimeout = setTimeout(() => {
            searchMovies(title);
        }, 1000);
        return () => clearTimeout(debounceTimeout);
    };

    useEffect(() => {
        searchMovies("wreck it");
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearchMovies(value);
    };

    return (
        <div className="app">
            <h1>Fish Flix</h1>
            <div className="search">
                <input
                    placeholder="Search for movies"
                    value={searchTerm}
                    onChange={handleInputChange}
                    type="text"
                />
                <img
                    src={SearchIcon}
                    alt="search"
                    onClick={() => searchMovies(searchTerm)}
                />
            </div>

            {movies.length > 0 ? (
                <div className="container">
                    {movies.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="empty">
                    <h2>No movies found</h2>
                </div>
            )}
        </div>
    );
}

export default App;
