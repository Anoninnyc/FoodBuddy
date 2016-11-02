import React, { Component } from 'react';
import { Link } from 'react-router';

const Nav = ({onClick, find, logout, name}) => (
    <div>
      <div className="navbar-fixed movieBuddyNav">
        <nav>
          <div className="nav-wrapper">
            <a href="#" onClick={() => (onClick("Home"))} className="brand-logo center">ReelPals</a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <Link to="/home"><li onClick={() => (onClick("Home"))}>Home</li></Link>
               <Link to="/MyRatings"><li onClick={() => (onClick("MyRatings"))}>My Ratings</li></Link>
                <Link to="/Friends"><li onClick={() => (onClick("Friends"))}>My Friends</li></Link>
               <Link to="/FindMovieBuddy"><li onClick={find}>New Buddies</li></Link>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
               <Link to="/inbox"><li onClick={() => (onClick("Inbox"))}>Notifications</li></Link>
               <Link to="/help"><li onClick={() => (onClick("Help"))}>Help!</li></Link>
               <Link to="/signup"><li onClick={logout}>Log Out</li></Link>
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
