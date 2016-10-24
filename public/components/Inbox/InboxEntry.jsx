import React, { Component } from 'react';


const InboxEntry = ({inboxName, accept, requestMovie, decline, requestType, messageInfo}) => (
<div className="InboxEntry Reponses collection-item row">
  <div className="col s3">
    <img className='profilethumnail' src={ 'http://bit.ly/1iKugwI'}/>
  </div>
  <div className="response col s9">
    <span className="inboxFriend"> Name:{inboxName} 
        <a className="waves-effect waves-light btn accept" onClick={()=>{accept(inboxName, requestMovie)}}> 
        Accept {inboxName}'s {requestType} request {movieParse(requestMovie)}</a>
        <a className="waves-effect waves-light btn decline" onClick={()=>{decline(inboxName, requestMovie)}}>
        Decline {inboxName}'s {requestType} request {movieParse(requestMovie)}</a></span>
    <br/> Message:{messageInfo === null ? 'No message' : messageInfo}
  </div>
</div>

);

export default InboxEntry;

function movieParse(movie) {
console.log("this is the movie", movie);
  if (!movie){
    return null;
  } else if (movie.length<14){
    return `for ${movie}`;
  } else {
    return `for ${movie.slice(0,13)}...`;
  }
}