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
  requestsOfCurrentUser: []
}

const mapRes=pending=>(
	pending.map(a=>(
		[a.requestor,a.requestTyp,a.movie===null?"": a.movie,"Message:"+ a.message==='null'?"none":a.message]
	))   
)

module.exports= {
  initialState,
  mapRes,
}
