import React, { Component } from 'react';


const Responses = ({movie, responsesInfo, responseAnswer, responseType, remove, self}) => {
  console.log('props.movie', movie)
  if (movie !== null) {
    return (
      <div className="Reponses collection-item row">
        <div className="col s3">
          <img className='profilethumnail' src={'https://bit.ly/1iKugwI'}/>
        </div>
        <div className="response col s9">
          <div className="responseMsg">{responsesInfo} said {responseAnswer} to your {responseType} request to watch {movie}!  
          <a className="waves-effect waves-light btn" onClick={()=>remove(responsesInfo, self, movie)}>Got it</a>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="Reponses collection-item row">
        <div className="col s3">
          <img className='profilethumnail' src={'http://bit.ly/1iKugwI'}/>
        </div>

        <div className="response col s9">
          <div className="responseMsg">{responsesInfo} said {responseAnswer} to your {responseType} request!</div>
          <a className="waves-effect waves-light btn" onClick={()=>remove(responsesInfo, self, null)}>Got it</a>
        </div>
      </div>
    );
  }
};

 export default Responses;