import { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import StarRating from '../StarRating/StarRating';

const MovieDetails = function ({ id, apiKey, onAddWatched, onSelectMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.map(movie => movie.imdbID).includes(id);
  const rated = watched?.filter(movie => movie.imdbID === id)?.at(0);

  const {
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Title: title,
    Year: year,
    imdbRating,
    Type: type,
  } = movie;

  const handleAdd = function () {
    const newWatchedMovie = {
      imdbID: id,
      imdbRating: Number(imdbRating),
      poster,
      runtime: Number(runtime.split(' ').at(0)),
      title,
      type,
      userRating,
      year,
    };

    onAddWatched(newWatchedMovie);
    onSelectMovie();
  };

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);

          const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
          const data = await response.json();

          setMovie(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }

      getMovieDetails();
    },
    [id]
  );

  useEffect(
    function () {
      if (!title) return;

      document.title = `usePopcorn - ${title}`;

      // prettier-ignore
      return function () { // Cleanup function
        document.title = 'usePopcorn';
      };
    },
    [title]
  );

  useEffect(
    function () {
      const callBack = function (e) {
        if (e.code === 'Escape') onSelectMovie();
      };

      document.addEventListener('keydown', callBack);

      return function () {
        document.removeEventListener('keydown', callBack);
      };
    },
    [onSelectMovie]
  );

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <img src={poster} alt={`${title} Poster`} />

            <div className='details-overview'>
              <h2>{title}</h2>

              <span>🗓️ {released}</span>
              <span>⏱️ {runtime}</span>
              <span>🎭 {genre}</span>
              <span>⭐ {imdbRating}</span>
              <span>
                {type === 'series' ? `🎬` : `🎞️`} {type}
              </span>

              {type === 'series' ? (
                <span>{year.split('–')[1] === '' ? `🟢 ${year}` : `🔴 ${year}`}</span>
              ) : (
                <span>{year}</span>
              )}
            </div>
          </header>

          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating size={24} onSetRating={setUserRating} />

                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      Add to Watched list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {rated.userRating} ⭐</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Staring: {actors}</p>

            <span>Directed by: {director}</span>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
