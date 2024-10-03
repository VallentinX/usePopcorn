import RenderSearchResults from '../RenderSearchResults/RenderSearchResults';

const SearchResults = function ({ movies, onSelectMovie }) {
  return (
    <ul className='list list-movies'>
      {movies?.map(movie => (
        <RenderSearchResults movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </ul>
  );
};
export default SearchResults;
