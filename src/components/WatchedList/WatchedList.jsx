import RenderWatchedResults from '../RenderWatchedResults/RenderWatchedResults';

const SearchResults = function ({ watched, onRemoveFromWatched }) {
  return (
    <ul className='list'>
      {watched?.map(movie => (
        <RenderWatchedResults
          movie={movie}
          onRemoveFromWatched={onRemoveFromWatched}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
};
export default SearchResults;
