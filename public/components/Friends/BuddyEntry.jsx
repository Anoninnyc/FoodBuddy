import React, { Component } from 'react';

const BuddyEntry = ({ Buddy, BuddyScore, buddyfunc, idx }) => (
  <div className="collection-item row">
    <div className="col s3">
    <img className="profilethumnail" src={'https://bit.ly/1iKugwI'} />
    </div>
    <div id="Friend" className="buddy col s9">
      <h3 className="buddyName">{Buddy}</h3>
      <div className="buddyCompatibility">{(BuddyScore === 'Nothing to compare') ? `Compatability: ${Buddy} has not rated any movies` : `Compatability: ${BuddyScore}%`}</div>
      <a  id = {idx} className="waves-effect waves-light btn" onClick={ ( ) => { buddyfunc(Buddy, idx); }}>Send friend request</a>
      <div id="friendReqConf" />
    </div>
  </div>
);

//
export default BuddyEntry;
