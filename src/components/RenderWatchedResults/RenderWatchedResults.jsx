const RenderWatchedResults = function ({ movie, onRemoveFromWatched }) {
  const { imdbID, imdbRating, poster, runtime, title, userRating, type } = movie;

  return (
    <li key={imdbID}>
      <img src={poster} alt={`${title} poster`} />

      <h3>{title}</h3>

      <span>
        {type === 'series' ? `🎬` : `🎞️`} {type}
      </span>

      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} min</span>
        </p>

        <button className='btn-delete' onClick={() => onRemoveFromWatched(movie.imdbID)}>
          ✕
        </button>
      </div>
    </li>
  );
};

export default RenderWatchedResults;
