import React, { Component } from 'react';
import MovieListEntry from '../Movies/MovieListEntry';

class SingleFriend extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentWillReceiveProps() {
  	console.log("‎componentWillReceiveProps");
  }

  shouldComponentUpdate() {
  	console.log("shouldComponentUpdate");
  }

  render() {
    console.log(this.props.friendName, 'friendName');
	// console.log('props.moviesOfFriend', moviesOfFriend)
    if (!this.props.moviesOfFriend.length) {
		return (
			<div>
			  <a id="backToAllFriends" className="center waves-effect waves-light btn" onClick={() => (this.props.onClick("Friends"))}>Back to all friends</a>
			  <h5 id="noFriendMovies" className="header lable">Sorry, {this.props.friendName} hasn't rated any movies.</h5>
			</div>
			);

	} else {
		return (
	  <div className="Home collection">
			<a id="backToAllFriends" className="center waves-effect waves-light btn" onClick={() => (this.props.onClick("Friends"))}>Back to all friends</a>
			<div className="header large"> list of {this.props.friendName}'s movies</div>
			<div className="moviesOfFriend">
				{this.props.moviesOfFriend.map(movie => <MovieListEntry friendName={this.props.friendName} movie={movie} change={this.props.change}/> )}
			</div>
		</div>
		);
	}
  }
};

//window.SingleFriend = SingleFriend;

export default SingleFriend;
