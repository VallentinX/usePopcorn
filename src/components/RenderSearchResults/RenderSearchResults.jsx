const RenderSearchResults = function ({ movie, onSelectMovie }) {
  const { imdbID, Poster: poster, Title: title, Type: type, Year: year } = movie;

  return (
    <li key={imdbID} onClick={() => onSelectMovie(imdbID)}>
      <img src={poster} alt={`${title} poster`} />

      <h3>{title}</h3>

      <span>
        {type === 'series' ? `🎬` : `🎞️`} {type}
      </span>

      <div>
        <p>
          <span>🗓️</span>
          <span>{year}</span>
        </p>
      </div>
    </li>
  );
};

export default RenderSearchResults;
