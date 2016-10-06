import React, { Component } from 'react'
import MovieListEntry from './MovieListEntry'
console.log(props.view,this.props.view, "this.props.view")
const MovieList = ({movies, change, view}) => (
	<div className='movieList'>
		{ movies.map((movie, i) => <MovieListEntry
      movie = {movie} 
      change = {change}
      key = {movie.title} 
      view={view}
      /> )}
	</div>
);

export default MovieList;