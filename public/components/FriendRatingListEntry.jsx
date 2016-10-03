import React, { Component } from 'react';


var FriendRatingListEntry = ({name, rating}) => (
  <div className="FriendRatingListEntry">
    <span id="friend">Name:{name}</span>
    <span id="rating">Rating:{rating}</span>
    <br/>
  </div>
);

export default FriendRatingListEntry;