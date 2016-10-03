const MovieList = ({movies, change}) => (
	<div className='movieList'>
		{ movies.map((movie, i) => <MovieListEntry
      movie = {movie} 
      change = {change}
      key = {movie.title} /> )}
	</div>)
};

export default MovieList;