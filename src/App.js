import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://start-wars-58d68-default-rtdb.asia-southeast1.firebasedatabase.app/films.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      let movies = [];
      for (const prop in data) {
        movies.push({
          id: prop,
          title: data[prop].title,
          openingText: data[prop].openingText,
          releaseDate: data[prop].releaseDate,
        });
      }

      const transformedMovies = movies.map((movieData) => {
        return {
          id: movieData.id,
          title: movieData.title,
          openingText: movieData.openingText,
          releaseDate: movieData.releaseDate,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const res = await fetch(
      "https://start-wars-58d68-default-rtdb.asia-southeast1.firebasedatabase.app/films.json",
      {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      }
    );
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
