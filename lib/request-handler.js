'use strict';
// /////////////////
// /////////////The algorithm
// ///////////////////
const helper = (num1, num2) => {
  const diff = Math.abs(num1 - num2);
  return 5 - diff;
};

const comp = (first, second) => {
  const final = [];
  for (let i = 0; i < first.length; i++) {
    for (let x = 0; x < second.length; x++) {
      if (first[i][0] === second[x][0]) {
        final.push(helper(first[i][1], second[x][1]));
      }
    }
  }

  const sum = final.reduce((a, b) => a + b, 0);
  return Math.round(20 * sum / final.length);
};

///////////////////////////////
/////////////////////////////
//////////////////////////

require('dotenv').config();
const mysql = require('mysql');
const Movie = require('../app/models/movie');
const Rating = require('../app/models/rating');
const Relation = require('../app/models/relation');
const User = require('../app/models/user');
const allRequest = require('../app/models/allRequest');
const Ratings = require('../app/collections/ratings');
const Users = require('../app/collections/users');
const allRequests = require('../app/collections/allRequests');
const VQ = require('../app/collections/vanillaQueries');
const Promise = require('bluebird');
const request = require('request');

const pool = mysql.createPool({
  connectionLimit: 4,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB
});


/////////////////
////user auth
/////////////////

exports.signupUser = (req, res) => {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({
    username: req.body.name
  }).fetch().then(found => {
    if (found) {
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
          username: req.body.name,
          password: req.body.password,
        })
        .then(user => {
          console.log('created a new user');
          res.status(201).send('login created');
        });
    }
  });
};


exports.sendWatchRequest = (req, response) => {
  console.log(req.body.requestee);
  let requestees;
  if (Array.isArray(req.body.requestee)) {
    requestees = req.body.requestee;
  } else {
    requestees = [req.body.requestee];
  }
  Promise.each(requestees, requestee => {
      allRequests.create({
        requestor: req.mySession.user,
        requestee,
        requestTyp: 'watch',
        movie: req.body.movie,
        message: req.body.message
      });
    })
    .then(done => {
      response.send('Success');
    })
    .catch(err => {
      response.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
};

exports.removeWatchRequest = (req, res) => {
  console.log("**********removeWatchRequest*********");
  const unform = req.body.requestee;
  const requestees = Array.isArray(unform)?unform:[unform];
  const requestor = req.body.requestor;
  const movie = req.body.movie;

  allRequest.forge({
    requestor,
    requestee: requestees,
    movie
  })
    .fetch()
    .then(theRequest => {
      theRequest.destroy()
        .then(() => {
          res.json({
            error: true,
            data: {
              message: 'User successfully deleted'
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: {
              message: err.message
            }
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
};


exports.sendRequest = (req, response) => {
  console.log('this is what Im getting', req.body);
  if (req.mySession.user === req.body.name) {
    response.send(["You can't friend yourself!"]);
    return;
  }
  const newRequest = {
    requestor: req.mySession.user,
    requestee: req.body.name,
    requestTyp: 'friend'
  };

    pool.getConnection((err, con) => {
      if (err) {
        console.log(err, 'sendRequest');
        throw err;
      }
      con.query(VQ.sendReq, req.mySession.user, (err, res) => {
        console.log(err);
        if (!res) {
          response.send(['no friends']);
        }
        const pplReqd = res.filter(a => a.response === null),
          requestees = pplReqd.map(a => a.requestee);
        console.log('names of people whom Ive requested as friends', pplReqd);
        con.query(VQ.insertRequest, newRequest, (err, resp) => {
          console.log('Last insert ID:', resp.insertId, "err", err);
          response.send(requestees);
          con.release();
        });
      });
    });
};


exports.listRequests = (req, response) => {
  const requestee = req.mySession.user;
  // console.log('requestee', requestee);
  pool.getConnection((err, con) => {
    console.log(err);
    con.query(VQ.listRequests(requestee), (err, res) => {
      console.log('all the people', res, 'err', err);
      response.send([res, requestee]);
      con.release();
    });
  });
};


exports.accept = function(req, response) {
  const requestor = req.body.personToAccept,
    requestee = req.mySession.user,
    movie = req.body.movie,
    requestType = 'friend';

  pool.getConnection((err, con) => {
    console.log(err);
    if (movie === '') {
      con.query(VQ.accept1(requestor, requestType, requestee), (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      });
    } else {
      con.query(VQ.accept2(requestor, movie, requestee), (err, res) => {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      });
    }

    con.query(VQ.accept3, requestor, (err, res) => {
      if (err) throw err;
      console.log('Last insert ID:', res[0].id, err);
      var person1 = res[0].id;
      con.query(VQ.accept3, requestee, (err, resp) => {
        if (err) throw err;
        console.log('Last insert ID:', resp[0].id, err);

        const person2 = resp[0].id,
          request = {
            user1id: person1,
            user2id: person2
          };
        const request2 = {
          user1id: person2,
          user2id: person1
        };

        console.log('the requests:::', request, request2);
        con.query(VQ.accept4, request, (err, res) => {
          if (err) throw err;
          console.log('Last insert ID:', res.insertId);

          con.query(VQ.accept4, request2, (err, res) => {
            if (err) throw err;
            console.log('Last insert ID:', res.insertId);
            response.send('Success');
            con.release();
          });
        });
      });
    });
  });
};


exports.removeRequest = (req, res) => {
  const requestor = req.body.requestor,
    requestee = req.body.requestee;

  allRequest.forge({
    requestor,
    requestee
  })
    .fetch().then(theRequest => {
      theRequest.destroy()
        .then(() => {
          res.json({
            error: true,
            data: {
              message: 'User successfully deleted'
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: {
              message: err.message
            }
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
};

exports.getThisFriendsMovies = (req, response) => {
  const movies = [];
  console.log(req.body.specificFriend);
  const person = req.body.specificFriend;
  let id = null,
    len = null;
  pool.getConnection((err, con) => {
    console.log(err);
    con.query(VQ.gtfm1, person, (err, resp) => {
      console.log(err);
      id = resp[0].id;
      console.log(id);
      con.query(VQ.gtfm2, id, (err, resp) => {
       console.log(err);
        len = resp.length;
        resp.forEach(a => {
          con.query(VQ.gtfm3, a.movieid, (err, resp) => {
            console.log(err);
            movies.push([resp[0].title, a.score, a.review]);
            console.log(movies);
            if (movies.length === len) {
              response.send(movies);
              con.release();
            }
          });
        });
      });
    });
  });
};


exports.findMovieBuddies = (req, response) => {
  const currentUser = req.mySession.user;
  console.log("you're trying to find buddies!!");
  User.query(qb => {
    qb.select('users.id', 'users.username');
  })
    .fetchAll()
    .then(allUsers => {
      const allUsersParsed = allUsers.models.map(models => models.attributes),
        people = allUsersParsed.map(a => a.username),
        Ids = allUsersParsed.map(a => a.id),
        idKeyObj = {},
        obj1 = {};

      Ids.forEach((id, idx) => {
        idKeyObj[id] = people[idx];
      });

      Ids.forEach((id, idx) => {
        obj1[idKeyObj[id]] = [];
      });


      Rating.query(qb => {
        qb.select('ratings.userid', 'ratings.movieid', 'ratings.score');
      })
        .fetchAll()
        .then(allRatings => {
          const respon = allRatings.models.map(models => models.attributes);
          console.log("this is an early respon  ", respon);

          respon.forEach((resp, idx) => {
            obj1[idKeyObj[resp.userid]].push([resp.movieid, resp.score]);
          });

         console.log("this is the obj1!", obj1, 'current user', currentUser);
          const currentUserInfo = obj1[currentUser],
            comparisons = {};

          for (var key in obj1) {
            if (key !== currentUser) {
              comparisons[key] = comp(currentUserInfo, obj1[key]);
            }
          }
          console.log(comparisons);
          const finalSend = [];

          for (var key in comparisons) {
            finalSend.push(comparisons[key] !== 'NaN%'?[key, comparisons[key]]:[key, 'No Comparison to Make']);
          }
          response.send(finalSend);
          // con.release();
        });
    });
};

exports.decline = (req, response) => {
  const requestor = req.body.personToDecline,
    requestee = req.mySession.user,
    movie = req.body.movie,
    requestType = 'friend',
    addOn = !movie ? ' AND requestTyp=' + '"' + requestType + '"' : ' AND movie =' + '"' + movie + '"';
  pool.getConnection((err, con) => {
    if (err) {
      console.log(err, 'decline');
      throw err;
    }
    con.query(VQ.decline(requestor, requestee, addOn), (err, res) => {
      if (err) {
        throw err;
      }
      console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
      con.release();
    });
  });
};

exports.signupUser = (req, res) => {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({
    username: req.body.name
  }).fetch().then(found => {
    if (found) {
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
        username: req.body.name,
        password: req.body.password,
      })
        .then(user => {
          console.log('created a new user');
          res.status(201).send('login created');
        })
        .catch(err => {
          console.log(err.message);
          res.status(400).json({
            error: true,
            data: {
              message: 'user cannot be created'
            }
          });
        });
    }
  });
};

exports.signinUser = (req, res) => {
  console.log('calling signin', req.body);
  new User({
    username: req.body.name
  }).fetch().then(found => {
    if (found) {
      new User({
        username: req.body.name,
        password: req.body.password
      }).fetch().then(user => {
        if (user) {
          req.mySession.user = user.attributes.username;
          console.log('found ', found.attributes.username);
          res.send(['it worked', req.mySession.user]);
        } else {
          console.log('wrong password');
          res.status(404).send('bad login');
        }
      });
    } else {
      res.status(404).send('bad login');
      console.log('user not found');
    }
  });
};

exports.logout = (req, res) => {
  req.mySession.destroy(err => {
    console.log(err);
  });
  console.log('logout');
  res.send('logout');
};


/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = (req, res) => {
  console.log('calling rateMovie');
  let userid;
  return new User({
      username: req.mySession.user
    }).fetch()
    .then(foundUser => {
      userid = foundUser.attributes.id;
      return new Rating({
          movieid: req.body.id,
          userid: userid
        }).fetch()
        .then(foundRating => {
          if (foundRating) {
            //since rating or review is updated seperatly in client, the following
            //make sure it gets updated according to the req
            // console.log('update rating', foundRating)
            let ratingObj;
            if (req.body.rating) {
              ratingObj = {
                score: req.body.rating
              };
            } else if (req.body.review) {
              ratingObj = {
                review: req.body.review
              };
            }
            return new Rating({
                'id': foundRating.attributes.id
              })
              .save(ratingObj);
          } else {
            console.log('creating rating');
            return Ratings.create({
              score: req.body.rating,
              userid,
              movieid: req.body.id,
              review: req.body.review
            });
          }
        });
    })
    .then(newRating => {
      console.log('rating created:', newRating.attributes);
      res.status(201).send('rating recieved');
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send('error');
    });
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = movieObj => {
  let genre = (movieObj.genre_ids) ? genres[movieObj.genre_ids[0]] : 'n/a';
  return new Movie({
      id: movieObj.id,
      title: movieObj.title,
      genre,
      poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
      release_date: movieObj.release_date,
      description: movieObj.overview.slice(0, 255),
      imdbRating: movieObj.vote_average
    }).save(null, {
      method: 'insert'
    })
    .then(newMovie => {
      console.log('movie created', newMovie.attributes.title);
      return newMovie;
    })
    .catch(err => {
      console.log(err.message, 'problem creating movie');
    });
};


//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// will get ratings for the current user

exports.getUserRatings = function(req, res) {
  Rating.query(qb => {
      qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
      qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
      qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review', 'ratings.updated_at');
      qb.where('users.username', '=', req.mySession.user);
      qb.orderBy('updated_at', 'DESC');
    })
    .fetchAll()
    .then(ratings => {
      //decorate it with avg friend rating
      return Promise.map(ratings.models, rating => {
        return attachFriendAvgRating(rating, req.mySession.user);
      });
    })
    .then(ratings => {
      console.log('retriving all user ratings');
      res.status(200).json(ratings);
    })
    .catch(err => {
      console.log(err.message, ' unable to retrive ratings');
      res.status(400).send('unable to retrive ratings');
    });
};

exports.getFriendUserRatings = function(req, res) {
  Rating.query(qb => {
      qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
      qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
      qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score as friendScore', 'ratings.review as friendReview', 'ratings.updated_at');
      qb.where('users.username', '=', req.query.friendName);
      qb.orderBy('updated_at', 'DESC');
    })
    .fetchAll()
    .then(ratings => {
      //decorate it with current user's rating
      return Promise.map(ratings.models, rating => {
        return attachUserRating(rating, req.mySession.user);
      });
    })
    .then(ratings => {
      console.log('retriving all user ratings');
      res.status(200).json(ratings);
    })
    .catch(err => {
      console.log(err.message, ' unable to retrive average friend ratings');
      res.status(400).send('unable to retrive average friend ratings');
    });
};

//a decorator function that attaches friend avg rating to the rating obj
const attachFriendAvgRating = (rating, username) => {
  return getFriendRatings(username, rating)
    .then(friendsRatings => {
      //if friendsRatings is null, Rating.attributes.friendAverageRating is null
      if (!friendsRatings) {
        rating.attributes.friendAverageRating = null;
      } else {
        rating.attributes.friendAverageRating = averageRating(friendsRatings);
      }
      return rating;
    });
};

//a decorator function that attaches user rating and reviews to the rating obj
const attachUserRating = (rating, username) => {
  return Rating.query(qb => {
      qb.innerJoin('users', 'users.id', '=', 'ratings.userid');
      qb.innerJoin('movies', 'movies.id', '=', 'ratings.movieid');
      qb.select('ratings.score', 'ratings.review');
      qb.where({
        'users.username': username,
        'movies.title': rating.attributes.title,
        'movies.id': rating.attributes.id
      });
    })
    .fetch()
    .then(userRating => {
      if (userRating) {
        rating.attributes.score = userRating.attributes.score;
        rating.attributes.review = userRating.attributes.review;
      } else {
        rating.attributes.score = null;
        rating.attributes.review = null;
      }
      return rating;
    })
    .catch(err => {
      console.log(err.message, ' cannot find user rating');
    });
};

//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = (req, res) => {
  console.log('handleGetFriendRatings, ', req.mySession.user, req.body.movie.title);
  getFriendRatings(req.mySession.user, {
      attributes: req.body.movie
    })
    .then(friendRatings => {
      res.json(friendRatings);
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send('unable to retrive friend ratings for the movie');
    });
};

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
const getFriendRatings = (username, movieObj) => {
  return User.query(qb => {
      qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
      qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
      qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
      qb.select('relations.user2id', 'movies.title', 'ratings.score', 'ratings.review');
      qb.where({
        'users.username': username,
        'movies.title': movieObj.attributes.title,
        'movies.id': movieObj.attributes.id
      });
    })
    .fetchAll()
    .then(friendsRatings => {
      //the following block adds the friendName attribute to the ratings
      return Promise.map(friendsRatings.models, friendRating => {
        return new User({
            id: friendRating.attributes.user2id
          }).fetch()
          .then(friend => {
            friendRating.attributes.friendUserName = friend.attributes.username;
            friendRating.attributes.friendFirstName = friend.attributes.firstName;
            return friendRating;
          })
          .catch(err => {
            console.log(err.message);
            throw err;
          });
      });
    })
    .then(friendsRatings => {
      return friendsRatings;
    })
    .catch(err => {
      console.log(err.message);
      throw err;
    });
};


//a helper function that averages the rating
//inputs ratings, outputs the average score;
const averageRating = (ratings) => {
  //return null if no friend has rated the movie
  if (ratings.length === 0) {
    return null;
  }
  return ratings.reduce((total, rating) => total + rating.attributes.score, 0) / ratings.length;
};


//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
const getOneMovieRating = (username, movieObj) => {
  return Rating.query(qb => {
      qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
      qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
      qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
      qb.where({
        'users.username': username,
        'movies.title': movieObj.title,
        'movies.id': movieObj.id
      });
    })
    .fetch()
    .then(rating => {
      if (!rating) {
        //if the user has not rated the movie, return an obj that has the movie information, but score is set to null
        return new Movie({
            title: movieObj.title,
            id: movieObj.id
          }).fetch()
          .then(movie => {
            movie.attributes.score = null;
            return movie;
          });
      } else {
        return rating;
      }
    })
    .then(rating => {
      return getFriendRatings(username, rating)
        .then(friendsRatings => {
          // console.log('friendsRatings', friendsRatings);
          rating.attributes.friendAverageRating = averageRating(friendsRatings);
          // console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
          return rating;
        })
        .catch(err => {
         // console.log(err.message, ' unable to retrieve friend ratings');
          throw err;
        });
    })
    .catch(err => {
      console.log(err.message, ' unable to retrieve friend ratings');
      throw err;
    });
};


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = (req, res) => {
  console.log('getMultipleMovieRatings');
  Promise.map(req.body.movies, movie => {
      //first check whether movie is in the database
      return new Movie({
          title: movie.title,
          id: movie.id
        }).fetch()
        .then(foundMovie => {
          //if not create one
          if (!foundMovie) {
            return addOneMovie(movie);
          } else {
            return foundMovie;
          }
        })
        .then(foundMovie => {
          // console.log('found movie', foundMovie);
          return getOneMovieRating(req.mySession.user, foundMovie.attributes);
        })
        .catch(err => {
          console.log(err, 'cannot add movie');
          throw err;
        });
    })
    .then(ratings => {
      console.log('sending rating to client');
      res.json(ratings);
    })
    .catch(err => {
      console.log(err, 'cannot get movie');
      throw err;
    });
};

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = (req, res) => {
  let params = {
    api_key: '9d3b035ef1cd669aed398400b17fcea2',
    primary_release_year: new Date().getFullYear(),
    include_adult: false,
    sort_by: 'popularity.desc'
  };

  let data = '';
  request({
      method: 'GET',
      url: 'https://api.themoviedb.org/3/discover/movie/',
      qs: params
    })
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      req.body.movies = JSON.parse(data).results;
      //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
      exports.getMultipleMovieRatings(req, res);

    })
    .on('error', error => {
      console.log(error, 'TheMovieDB does not respond');
    });

};

//this is TMDB's genre code, we might want to place this somewhere else
const genres = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10769: 'Foreign',
  10770: 'TV Movie'
};

//this function will send back searcb movies user has rated in the database
//it will send back movie objs that match the search input, expects movie name in req.body.title
exports.searchRatedMovie = function(req, res) {
  return Rating.query(qb => {
      qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
      qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
      qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
      qb.whereRaw(`MATCH (movies.title) AGAINST ('${req.query.title}' IN NATURAL LANGUAGE MODE)`);
      qb.andWhere('users.username', '=', req.mySession.user);
      qb.orderBy('updated_at', 'DESC');
    })
    .fetchAll()
    .then(matches => {
     // console.log(matches.models);
      res.json(matches);
    })
    .catch(err => {
      console.log(err.message, ' unable to search DB');
      res.status(400).send('unable to search');
    });
};

////////////////////////
/////friendship handlers
////////////////////////

exports.getFriendList = function(req, res) {
  return Relation.query(qb => {
      qb.innerJoin('users', 'relations.user1id', '=', 'users.id');
      qb.select('relations.user2id');
      qb.where({
        'users.username': req.mySession.user
      });
    })
    .fetchAll()
    .then(friends => {
      return Promise.map(friends.models, friend => {
        return new User({
            id: friend.attributes.user2id
          }).fetch()
          .then(friendUser => {
            return friendUser.attributes.username;
          })
          .catch(err => {
            console.log(err.message);
            throw err;
          });
      });
    })
    .then(friends => {
      console.log('sending a list of friend names', friends);
      res.json(friends);
    })
    .catch(err => {
      console.log(err.message, ' unable to get friends');
      res.status(400).send('unable to get friends');
    });
};


exports.getFriends = (req, res) => {
  const id = req.mySession.user;

  new User({
    username: id
  }).fetch().then(found => {
    if (found) {
      const userid = found.id;
      console.log("qb****", userid, "****qb");
      return userid;
    } else {
      console.log("not found!");
    }
  }).then(userid => {
    let friendsObj = {};

    Rating.query(qb => {
        qb.select('ratings.movieid', 'ratings.score');
        qb.where('ratings.userid', '=', userid);
      })
      .fetchAll()
      .then(ratings => {
        return ratings.models.map(model => [model.attributes.movieid, model.attributes.score]);
      }).then(usersRatings => {
        console.log("THESE ARE THE USERSRATINGS", usersRatings);

        Relation.query(qb => {
          qb.select('Relations.user2id');
          qb.where('Relations.user1id', '=', userid);
        })
          .fetchAll()
          .then(relations => {
            console.log("this is relations", relations.models.map(model => model.attributes.user2id));
            return relations.models.map(model => model.attributes.user2id);
          }).then(peopleId => {
            console.log("THIS IS peopleID", peopleId);
            const people = [],
             keyId = {};

            if (!peopleId.length) {
              res.send([]);
              return;
            }

            console.log("********didnotreturn***********");

            pool.getConnection((err, con) => {
              console.log(err);
              peopleId.forEach(a => {
                con.query(VQ.getFriends1, a, (err, resp) => {
                  keyId[a] = resp[0].username;
                  console.log('ONE of the people!!', resp[0].username);
                  con.query(VQ.getFriends2(a), (err, resp) => {
                    if (!resp.length) {
                      resp = [{
                        userid: a,
                        movieid: Math.round(Math.random() * 10000),
                        score: 99
                      }];
                    }
                    // console.log('this should be the ratings from each person!!', re);

                    people.push(resp.map(a => ([a.userid, a.movieid, a.score])));

                    if (people.length === peopleId.length) {
                      const friendsProf = {};

                      console.log('this should be people', people);
                      for (var i = 0; i < people.length; i++) {
                        if (people[i][0] !== undefined) {
                          friendsProf[keyId[people[i][0][0]]] = [];
                          for (var x = 0; x < people[i].length; x++) {
                            friendsProf[keyId[people[i][0][0]]].push([]);
                            for (var z = 1; z < people[i][x].length; z++) {
                              friendsProf[keyId[people[i][0][0]]][x].push(people[i][x][z]);
                            }
                          }
                        }
                      }

                      console.log('final', friendsProf, usersRatings);

                      const comparisons = {},
                        totalComps = [];
                      for (var key in friendsProf) {
                        comparisons[key] = comp(usersRatings, friendsProf[key]);
                      }                    
                      for (var key in comparisons) {
                        totalComps.push([key, comparisons[key]]);
                      }

                      totalComps.forEach(user => {
                        if (user[1]===null || (user[1]!==user[1])) {
                          user[1]="No comparison to be made";
                        }
                      });
                      const sortedComps=totalComps.sort((a, b) => (b[1]-a[1]));

                      console.log("Sending back this!", sortedComps);

                      res.send(sortedComps);
                      con.release();
                    }
                  });
                });
              });
            });
          });
      });
  });
};
