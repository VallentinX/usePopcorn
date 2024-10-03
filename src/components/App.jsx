import { useEffect, useState } from 'react';
import NavigationBar from './NavigationBar/NavigationBar';
import Logo from './Logo/Logo';
import SearchBar from './SearchBar/SearchBar';
import ResultsStatistics from './ResultsStatistics/ResultsStatistics';
import Main from './Main/Main';
import BoxComponent from './BoxComponent/BoxComponent';
import SearchResults from './SearchResults/SearchResults';
import WatchedList from './WatchedList/WatchedList';
import Loader from './Loader/Loader';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import MovieDetails from './MovieDetails/MovieDetails';

import Summary from './Summary/Summary';

const apiKey = 'c0a62747';

const App = function () {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [watched, setWatched] = useState(function () {
    return JSON.parse(localStorage.getItem('watched')) || [];
  });
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSelectMovie = function (id) {
    setSelectedMovie(id && selectedMovie === id ? null : id);
  };

  const handleAddWatched = function (movie) {
    setWatched(watched => [...watched, movie]);
  };

  const handleRemoveFromWatched = function (id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  };

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchAPI() {
        try {
          setIsLoading(isLoading => !isLoading);
          setError('');

          const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`, {
            signal: controller.signal,
          });

          if (!response.ok) throw new Error('Something went wrong!');

          const data = await response.json();

          if (data.Response === 'False') throw new Error('Movie not found!');

          setMovies(data.Search);
          setError('');
        } catch (error) {
          if (error.name !== 'AbortError') setError(error.message);
        } finally {
          setIsLoading(isLoading => !isLoading);
        }
      }

      if (!query || query.length < 3) {
        setMovies([]);
        handleSelectMovie();

        return;
      }

      handleSelectMovie();
      fetchAPI();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      {/* Navigation Component */}
      <NavigationBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <ResultsStatistics movies={movies} />
      </NavigationBar>

      {/* Main Component */}
      <Main>
        {/* RenderSearchedMovies */}
        <BoxComponent>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <SearchResults movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </BoxComponent>

        {/* RenderWatchedMovies */}
        <BoxComponent>
          {selectedMovie ? (
            <MovieDetails
              id={selectedMovie}
              apiKey={apiKey}
              onAddWatched={handleAddWatched}
              onSelectMovie={handleSelectMovie}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} onRemoveFromWatched={handleRemoveFromWatched} />
            </>
          )}
        </BoxComponent>
      </Main>
    </>
  );
};

export default App;
