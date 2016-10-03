import React, { Component } from 'react';

const FriendRatingList = ({friendRatings, getFriendMovieRatings}) => (
  <div className="friendRating-list">
    <div id='inputAndButton'><input type='text' name='movie' id="movieToView"/>
    <button type='submit' onClick={getFriendMovieRatings}>Click Me</button></div>
    {friendRatings.map(friendRating => <FriendRatingListEntry rating={friendRating.rating} name={friendRating.name}/>)}
  </div>
);

export default FriendRatingList;