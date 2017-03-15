const initialState = {
  view: 'Login',
  friendsRatings: [],
  movie: null,
  friendRequests: [],
  pendingFriendRequests: [],
  myFriends: [],
  friendToFocusOn: '',
  individualFriendsMovies: [],
  potentialMovieBuddies: {},
  username: null,
  requestResponses: [],
  currentUser: null,
  requestsOfCurrentUser: [],
  whence: "",
};

const mapRes = pending => (
	pending.map(a => (
		[a.requestor, a.requestTyp, a.movie===null?"": a.movie, `Message:${a.message}`==='null'?"none":a.message]
	))
);

const fadeIn = mess => {
  $(document).scrollTop(0);
  $(`${mess},${mess}${2}`).fadeIn(1000);
  $(`${mess},${mess}${2}`).fadeOut(1000);
};

module.exports= {
  initialState,
  mapRes,
  fadeIn
};
