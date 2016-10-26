import React, { Component } from 'react';


const MovieList = ({movies, change, view}) => (
	<div className='movieList'>
	  { movies.map((movie, i) => 
		<MovieListEntry
	      movie = {movie}
	      change = {change}
	      key = {movie.title}
	    /> 
	  )}
	</div>
);

export default MovieList;