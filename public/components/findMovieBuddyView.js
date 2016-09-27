const FindMovieBuddy = ({buddyfunc, buddies}) => {
	let empty=buddies.length===0?"You've friended everybody!":"";
  return (
  <div className='movieBuddy collection'>
	  <div className='header'>Find Your Next Movie Buddy</div><br/>
	    <br/>
  <div className="errorMsg" style={{display: 'none'}} id='AlreadyReq2'>Youve already sent a request to this user!</div>
  <div className="errorMsg" style={{display: 'none'}} id='enterRealFriend2'>Please enter something!</div>
  <div className="errorMsg" style={{display: 'none'}} id='reqSent2'>Request sent!</div>
	{empty}
   {buddies.map(buddy=>{ if (buddy[1]===null) {buddy[1]='Nothing to compare'} return (<BuddyEntry buddyfunc={buddyfunc} Buddy={buddy[0]} BuddyScore={buddy[1]} /> )})}

  </div>
   
)};

window.FindMovieBuddy = FindMovieBuddy;