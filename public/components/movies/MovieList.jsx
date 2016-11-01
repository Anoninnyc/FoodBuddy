import React, { Component } from 'react';
import MovieListEntry from './MovieListEntry';

const MovieList = ({movies, change, view, whence}) => (
	<div className='movieList'>
	{movies.map((movie, i) =>
		<MovieListEntry
	      movie={movie}
	      change={change}
	      key={movie.title}
	      whence={whence}
	    />
	  )}
	</div>
);

export default MovieList;