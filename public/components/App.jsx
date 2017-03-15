import React, { Component } from 'react';

import Nav from './Nav';
import LogIn from './UserAuth/LogIn';
import SignUp from './UserAuth/SignUp';
import MovieRating from './Movies/MovieRating';
import Inbox from './Inbox/Inbox';
import Friends from './Friends/Friends';
import Home from './Home/home';
import SingleMovieRating from './Movies/SingleMovieRating';
import SingleFriend from './Friends/SingleFriend';
import FindMovieBuddy from './Friends/findMovieBuddyView';
import MyRatings from './Movies/MyRatings';
import { initialState, mapRes, fadeIn } from '../utils';
import Help from './Help';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.sendWatchRequest=this.sendWatchRequest.bind(this);
    this.getFriends=this.getCurrentFriends.bind(this);
    this.myFriends=this.state.myFriends;
    this.logout=this.logout.bind(this);
    this.sendRequest=this.sendRequest.bind(this);
    this.changeViews=this.changeViews.bind(this);
    this.setCurrentUser=this.setCurrentUser.bind(this);
    this.getMovie=this.getMovie.bind(this);
    this.acceptFriend= this.acceptFriend.bind(this);
    this.declineFriend=this.declineFriend.bind(this);
    this.changeViewsMovie=this.changeViewsMovie.bind(this);
    this.changeViewsFriends=this.changeViewsFriends.bind(this);
    this.findMovieBuddies=this.findMovieBuddies.bind(this);
    this.listPendingFriendRequests=this.listPendingFriendRequests.bind(this);
    this.focusOnFriend=this.focusOnFriend.bind(this);
    this.removeRequest=this.removeRequest.bind(this);
  }

  getCurrentFriends() {
    $.post(`${Url}/getFriends`, { test: 'info' }, (friends, err) => {
      this.setState({
        myFriends: friends
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }


  acceptFriend(personToAccept, movie) {
    console.log('calling accept Friend');

    $.post(`${Url}/accept`, { personToAccept, movie }, (resp, err) => {
      const pending=this.state.pendingFriendRequests;
      const reqs = pending.map((a) => (a.requestor));
      pending.splice(reqs.indexOf(personToAccept), 1);
      this.setState({ pendingFriendRequests: pending });
      console.log('after', this.state.pendingFriendRequests);
    });
  }

  declineFriend(personToDecline, movie) {
    $.post(`${Url}/decline`, { personToDecline, movie }, (resp, err) => {
      const pending=this.state.pendingFriendRequests;
      const reqs = pending.map((a) => (a.requestor));
      pending.splice(reqs.indexOf(personToDecline), 1);
      this.setState({ pendingFriendRequests: pending });
    });
  }


  findMovieBuddies() {
   // console.log('this.state.MyFriends', this.state.myFriends);
    $.post(`${Url}/findMovieBuddies`, { dummy: 'info' }, (resp, err) => {
      // const friendNames=this.state.myFriends.map((info) => (info[0]));

      console.log("resp", resp);

      const myFriends=this.state.myFriends;
      const uniqueFriends=[];
      for (let i=0; i<resp.length; i++) {
        let unique=true;
        for (let x=0; x<myFriends.length; x++) {
          if (resp[i][0]===myFriends[x][0]) {
            unique=false;
          }
        }

        if (unique) {
          uniqueFriends.push(resp[i]);
        }
      }

      this.setState({
        view: "FNMB",
        potentialMovieBuddies: uniqueFriends
      });
    });
  }


  changeView() {
    this.setState({
      view: "SignUp"
    });
  }

  setCurrentUser(username) {
    // console.log('calling setCurrentUser');
    this.setState({
      currentUser: username
    });
  }

  enterNewUser(name, password) {
    // console.log(name,password);
    $.post(`${Url}/signup`, {
      name,
      password
    }).then(() => {
      this.setState({
        username: name,
        view: "Home"
      });
    }).catch(() => {
      console.log('error');
    });
  }

  getFriendMovieRatings() {
    const movieName = document.getElementById("movieToView").value;
    $.post(`${Url}/getFriendRatings`, {
      name: movieName
    }).then(response => {
      this.setState({
        view: "Home",
        friendsRatings: response
      });
    }).catch(err => {
      console.log(err);
    });
  }


  logout() {
    $.post(`${Url}/logout`).then(response => {
      this.setState(initialState);
    });
  }

  sendWatchRequest(friend) {
    const movie= document.getElementById('movieToWatch').value;
    const toSend={ requestee: friend, movie };
    if (movie.length) {
      $.post(`${Url}/sendWatchRequest`, toSend, (resp, err) => {
        // console.log(resp, err);
      });
      document.getElementById('movieToWatch').value='';
    } else {
      // console.log('you need to enter a movie to send a watch request!!!!')
    }
  }


  // ///////////////////
  // ///movie render
  // ///////////////////
  // call searchmovie function
  // which gets passed down to the Movie Search
  getMovie(query) {
    const options = {
      query
    };

    this.props.searchMovie(options, movie => {
      // console.log(movie);
      this.setState({
        view: "MovieSearchView",
        movie
      });
    });
  }
  // show the movie searched in friend movie list
  // onto the stateview of moviesearchview
  showMovie(movie) {
    this.setState({
      movie
    });
  }
  // /////////////////////
  // ///Nav change
  // ///////////////////
  changeViews(targetState) {
    if (targetState==='Friends') {
      this.getCurrentFriends();
    }

    if (targetState==='Home') {
      this.sendRequest();
    }

    if (targetState==="Inbox") {
      this.listPendingFriendRequests();
    }
    if (targetState==='FNMB') {
      this.getCurrentFriends();
    }

    this.setState({
      view: targetState
    });
  }


  changeViewsMovie(targetState, movie, myRatings, whence) {

    // console.log("You're singling in on a movie!", targetState, movie, myRatings, whence);

    this.setState({
      view: targetState,
      movie,
      whence,
    });
  }

  changeViewsFriends(targetState, friend) {
    this.setState({
      view: targetState,
      friendToFocusOn: friend
    });
  }

  sendRequest(buddy) {
    if (typeof buddy==="object") {
      var person = document.getElementById('findFriendByName').value;
    } else {
      var person = buddy || 'test';
    }

    const currFriends=this.state.myFriends;
    const friends1=currFriends.map(friendInfo => (friendInfo[0]));
    this.state.requestsOfCurrentUser.forEach(req => {
      friends1.push(req);
    });

    if (friends1.indexOf(person)!== -1 && friends1.length!==0) {
      fadeIn("#AlreadyReq");
    } else if (!person.length) {
      fadeIn("#enterRealFriend");
    } else {
      $.post(`${Url}/sendRequest`, { name: person }, (resp, err) => {
        if (resp.indexOf(person)>-1) {
          fadeIn("#AlreadyReq");
        } else {
          fadeIn("#reqSent");
        }
        if (!this.isUnmounted) {
          this.setState({
            requestsOfCurrentUser: resp.concat([person])
          });
        }
      });


      if (document.getElementById('findFriendByName')!==null) {
        document.getElementById('findFriendByName').value = '';
      }
    }
  }

  listPendingFriendRequests() {
   // console.log('this should list friend reqs');
    $.post(`${Url}/listRequests`, (response, error) => {
      const pFR=[];
      const rR=[];


      for (let i=0; i<response[0].length; i++) {
        const requestor=response[0][i].requestor;
        const responseTU= response[0][i].response;
        if (requestor!==response[1] && responseTU===null) {
          pFR.push(response[0][i]);
        }
        if (requestor===response[1] &&responseTU!==null && response[0][i].requestee!=='test') {
          rR.push(response[0][i]);
        }
      }
      // console.log("Totality of inbox", pFR, rR);

      this.setState({
        pendingFriendRequests: pFR,
        requestResponses: rR
      });
    });
  }

  focusOnFriend(friend) {
    //
    this.setState({
      view: 'singleFriend',
      friendToFocusOn: friend
    });

    $.get(`${Url}/getFriendUserRatings`, { friendName: friend }, response => {
      this.setState({
        individualFriendsMovies: response
      });
    });
  }
//
  removeRequest(person, self, movie) {
   // console.log('trying to rem req');
    const that= this;
    $.ajax({
      url: `${Url}/removeRequest`,
      type: 'DELETE',
      data: {
        requestor: self,
        requestee: person,
        movie
      },
      success(response) {
        console.log('REQUEST REMOVED! Movie is: ', movie);
        that.listPendingFriendRequests();
      },
      error(error) {
        console.log(error);
      }
    });
  }

  render() {
    const nav = (
      <Nav
        name={this.state.currentUser}
        find={this.findMovieBuddies}
        onClick={this.changeViews}
        logout={this.logout}
      />);


    if (this.state.view==='Login') {
      return (
        <LogIn
          changeViews={this.changeViews}
          setCurrentUser={this.setCurrentUser}
          getCurrentFriends={this.getFriends}
        />
      );
    } else if (this.state.view==="SignUp") {
      return (
        <SignUp
          changeViews={this.changeViews}
          setCurrentUser={this.setCurrentUser}
          getCurrentFriends={this.getFriends}
        />
      );
    }
    // this view is added for moviesearch rendering
    else if (this.state.view === "MovieSearchView") {
      return (
        <div>
          {nav}
          <MovieRating
            handleSearchMovie={this.getMovie}
            movie={this.state.movie}
          />
        </div>
      );
    } else if (this.state.view === "Inbox") {
      return (
        <div>
          {nav}
          <Inbox
            requests={this.state.pendingFriendRequests}
            responsesAnswered={this.state.requestResponses}
            logout={this.logout}
            accept={this.acceptFriend}
            decline={this.declineFriend}
            listRequests={this.listPendingFriendRequests}
            pplWhoWantToBeFriends={mapRes(this.state.pendingFriendRequests)}
            remove={this.removeRequest}
          />
        </div>
      );
    } else if (this.state.view === "Friends") {
      return (
        <div>
          {nav}
          <Friends
            sendWatchRequest={this.sendWatchRequest}
            fof={this.focusOnFriend}
            getFriends={this.getCurrentFriends}
            myFriends={this.state.myFriends}
            listPotentials={this.listPotentials}
            logout={this.logout}
            sendRequest={this.sendRequest}
          />
        </div>
      );
    }
    else if (this.state.view === "Home") {
      return (
        <div>
          {nav}
          <Home
            change={this.changeViewsMovie}
          />
        </div>
      );
    } else if (this.state.view === "SingleMovie") {
      return (
        <div>
          {nav}
          <SingleMovieRating
            compatibility={this.state.myFriends}
            currentMovie={this.state.movie}
            change={this.changeViewsFriends}
            fof={this.focusOnFriend}
            whence={this.state.whence}
            changeViews={this.changeViews}
          />
        </div>
      );
    } else if (this.state.view==='singleFriend') {
      return (
        <div>
          {nav}
          <SingleFriend
            moviesOfFriend={this.state.individualFriendsMovies}
            friendName={this.state.friendToFocusOn}
            onClick={this.changeViews}
            change={this.changeViewsMovie}
          />
        </div>
      );
    } else if (this.state.view === "FNMB") {
      return (
        <div>
          {nav}
          <FindMovieBuddy
            buddyfunc={this.sendRequest}
            buddies={this.state.potentialMovieBuddies}
          />
        </div>
      );
    } else if (this.state.view === "MyRatings") {
      return (
        <div>
          {nav}
          <MyRatings
            change={this.changeViewsMovie}
          />
        </div>
      );
    } else if (this.state.view ==="Help") {
      return (
        <div>
          {nav}
          <Help />
        </div>
      );
    }
  }
}


const Url = 'https://reelpals-io.herokuapp.com';
//var Url = 'http://127.0.0.1:3000';
window.Url = Url;

export default App;

