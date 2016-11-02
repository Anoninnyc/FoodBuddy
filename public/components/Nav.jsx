import React, { Component } from 'react';
import { Link } from 'react-router';

const Nav = ({onClick, find, logout, name}) => (
    <div>
      <div className="navbar-fixed movieBuddyNav">
        <nav>
          <div className="nav-wrapper">
            <a href="#" onClick={() => (onClick("Home"))} className="brand-logo center">ReelPals</a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <Link to="/home"><li><a onClick={() => (onClick("Home"))}>Home</a></li></Link>
               <Link to="/MyRatings"><li><a onClick={() => (onClick("MyRatings"))}>My Ratings</a></li></Link>
                <Link to="/Friends"><li><a onClick={() => (onClick("Friends"))}>My Friends</a></li></Link>
               <Link to="/FindMovieBuddy"><li><a onClick={find}>New Buddies</a></li></Link>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
               <Link to="/inbox"><li><a onClick={() => (onClick("Inbox"))}>Notifications</a></li></Link>
               <Link to="/help"><li><a onClick={() => (onClick("Help"))}>Help!</a></li></Link>
               <Link to="/signup"><li><a onClick={logout}>Log Out</a></li></Link>
            </ul>
          </div>
        </nav>
      </div>
      <div className="headBand">
        <h3>Hi, {name}!</h3>
      </div>
    </div>
);

export default Nav;
