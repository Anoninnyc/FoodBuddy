import React, { Component } from 'react';

import Nav from './Nav';
import LogIn from './UserAuth/LogIn';
import SignUp from './UserAuth/SignUp';
import MovieRating from './Movies/MovieRating';
import Inbox from './Inbox/Inbox';
import Friends from './Friends/Friends';
import Home from './Home/Home';
import SingleMovieRating from './Movies/SingleMovieRating';
import SingleFriend from './Friends/SingleFriend';
import FindMovieBuddy from './Friends/FindMovieBuddyView';
import MyRatings from './Movies/MyRatings';
import { initialState, mapRes } from '../utils';


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
    this.removeRequest=this.removeRequest.bind(this);//
  }

  getCurrentFriends() {
    // console.log('testinggg');
    $.post(`${Url}/getFriends`, { test: 'info' }, (friends, err) => {
      friends.forEach(friend => {
        if (friend[1]===null) {
          friend[1]="No comparison to be made";
        }
      });
             // for (let i=0;i<a.length;i++){
             //    if (a[i][1]===null){
             //      a[i][1] = "No comparison to be made";
             //    }
             //  }

      const sortedFriends= friends.sort((a, b) => { return b[1]-a[1]; });
      console.log('this is what GCF is setting as all friends', sortedFriends);
      this.setState({
        myFriends: sortedFriends
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
      // console.log('before', pending, reqs, personToAccept);
      pending.splice(reqs.indexOf(personToAccept), 1);
      this.setState({ pendingFriendRequests: pending });
      console.log('after', this.state.pendingFriendRequests);
      // that.listPendingFriendRequests();
    });
    // console.log('refreshed inbox, should delete friend request on the spot instead of moving')
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
    console.log('this.state.MyFriends', this.state.myFriends);
    $.post(`${Url}/findMovieBuddies`, { dummy: 'info' }, (resp, err) => {
      const friendNames=this.state.myFriends.map((info) => (info[0]));
      console.log("friendNames", friendNames);
      const sorted=resp.sort((a, b) => (b[1]-a[1]));
      console.log(sorted, "sorted", this.state.myFriends, "this.myFriends");
      const myFriends=this.state.myFriends;
      const uniqueFriends=[];
      for (let i=0; i<sorted.length; i++) {
        let unique=true;
        for (let x=0; x<myFriends.length; x++) {
          if (sorted[i][0]===myFriends[x][0]) {
            unique=false;
          }
        }

        if (unique) {
          console.log(sorted[i][0]);
          uniqueFriends.push(sorted[i]);
        }
      }
      console.log("unique POTENTIAL NEW friends", uniqueFriends);

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
    $.post(`${Url}/signup`, { name, password }).then(() => {
      // console.log('success');
      this.setState({ username: name, view: "Home" });
    }).catch(() => { console.log('error'); });
  }

  getFriendMovieRatings() {
    const movieName = document.getElementById("movieToView").value;
    $.post(`${Url}/getFriendRatings`, { name: movieName }).then(response => {
      this.setState({
        view: "Home",
        friendsRatings: response
      });
    // console.log('our response',this.state.friendsRatings)
    }).catch(err => { console.log(err); });
  }


  logout() {
    $.post(`${Url}/logout`).then(response => {
      // console.log(response);
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


  changeViewsMovie(targetState, movie) {
    this.setState({
      view: targetState,
      movie
    });
  }

  changeViewsFriends(targetState, friend) {
    this.setState({
      view: targetState,
      friendToFocusOn: friend
    });
  }

  sendRequest(a, idx) {
    console.log(typeof a);
    if (typeof a==="object") {
      var person=document.getElementById('findFriendByName').value;
      console.log('part 1');
    } else {
      console.log('part 2');
      var person = a || 'test';
    }

    const currFriends=this.state.myFriends;
    const friends1=currFriends.map(friendInfo => (friendInfo[0]));
    this.state.requestsOfCurrentUser.forEach(req => {
      friends1.push(req);
    });


    // console.log('this should also be my friends',person, currFriends,friends1,friends2)
    console.log('these should be my current friends and inMem requests and I should not be able ot send to them', friends1);
    if (friends1.indexOf(person)!== -1 && friends1.length!==0) {
      $(document).scrollTop(0);
      console.log('case caught 254');
      $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
      $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);

      // console.log('this person is already in there!!')
    } else if (!person.length) {
      $(document).scrollTop(0);
      $("#enterRealFriend,#enterRealFriend2").fadeIn(1000);
      $("#enterRealFriend,#enterRealFriend2").fadeOut(1000);
    } else {
// console.log('person is defined?',person);
      $.post(`${Url}/sendRequest`, { name: person }, (resp, err) => {
        console.log('should include everybody to whom a req has ever been sent, short of most recent', resp);
        $(document).scrollTop(0);
        if (resp.indexOf(person)>-1) {
          console.log('case caught 272');
          $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
          $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);
        } else {
          $("#reqSent,#reqSent2").fadeIn(1000);
          $("#reqSent,#reqSent2").fadeOut(1000);
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
    console.log('this should list friend reqs');
    $.post(`${Url}/listRequests`, (response, error) => {
      const pFR=[];
      const rR=[];
      console.log('response to lpfr', response);


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
      //
      console.log("Totality of inbox", pFR, rR);

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
    const nav = (<Nav name={this.state.currentUser}
      find={this.findMovieBuddies}
      onClick={this.changeViews}
      logout={this.logout}
    />);


    if (this.state.view==='Login') {
      return (
        <LogIn changeViews={this.changeViews}
          setCurrentUser={this.setCurrentUser}
          getCurrentFriends={this.getFriends}
        />
      );
    } else if (this.state.view==="SignUp") {
      return (
        <SignUp changeViews={this.changeViews}
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
    }
  }
}


let Url = 'https://reelfriendz.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
// window.Url = Url

export default App;

