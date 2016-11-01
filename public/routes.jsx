// Modules
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Local Imports
import App from './components/App';
import LogIn from './components/UserAuth/LogIn';
import SignUp from './components/UserAuth/SignUp';
import Home from './components/Home/home';
import Inbox from './components/Inbox/Inbox';
import MovieRating from './components/Movies/MovieRating';
import Friends from './components/Friends/Friends';
import SingleFriend from './components/Friends/SingleFriend';
import FindMovieBuddy from './components/Friends/findMovieBuddyView';
import MyRatings from './components/Movies/MyRatings';
import Help from './components/Help';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="login" component={LogIn} />
    <Route path="signup" component={SignUp} />
    <Route path="FindMovieBuddy" component={FindMovieBuddy} />
    <Route path="inbox" component={Inbox} />
    <Route path="MovieRating" component={MovieRating} />
    <Route path="Friends" component={Friends} />
    <Route path="SingleFriend" component={SingleFriend} />
    <Route path="MyRatings" component={MyRatings} />
    <Route path="*" component={Help} />
  </Route>
);
