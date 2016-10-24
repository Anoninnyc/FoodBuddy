import React, {Component} from 'react';
import MovieList from './MovieList';

class MyRatings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      allRatedMovies: true,
      search: ''
    };
  }

  // show render a list of recent releases on initialize
  componentDidMount() {
    this.getAllRatedMovies();
  }

  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  }


  getAllRatedMovies() {
    console.log(this.state.movies);
    $.get(Url + '/getUserRatings')
      .then(userRatedMovies => {
        console.log('response from server', userRatedMovies);
        this.setState({
          movies: userRatedMovies,
          allRatedMovies: true
        });
      });
  }

  //////////////////////
  /////Event Handlers
  //////////////////////

  //this will call search for a movie from external API, do a database query for rating
  //and set the reponse to the movies state

  handleSearch(event) {
    if (event.charCode == 13 || event === 'clicked') {
      console.log(this.state.search, this.state.movies);
      const that = this;
      let found = false;
      const moviesThatMatch = []

      this.state.movies.forEach((el, idx) => {
        console.log('here it is', el.title.toLowerCase(), this.state.search.toLowerCase());
        if (el.title.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1) {
          console.log(this.state.search);
          moviesThatMatch.push(el);
          found = true;
        }
      });
      if (!found) {
        $("#movNotInColl").fadeIn(1000);
        $("#movNotInColl").fadeOut(1000);
        console.log('should now show them message that there is no such movie');
      } else {
        that.setState({
          movies: moviesThatMatch,
          allRatedMovies: false
        });
      }
    }
  }


  render() {
    var lable;
    var results;
    if (this.state.allRatedMovies === false) {
      lable = 'Back To All Rated Movies';
      results = (this.state.movies.length === 0) ? (<div className="errorMsg">Results cannot be found</div>) : (<h5 className="updateMsg">All matching results</h5>)
    } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
      lable = 'You have not rated any movies';
    } else {
      lable = 'All Rated Movies';
    }

    return (
      <div className='MyRatings collection'>
        <div className='header' onClick={this.getAllRatedMovies.bind(this)}>{lable}</div>
        <div className='searchMovie'>
          <input type ='text' id='movieInput'
            className='movieInput'
            value={this.state.search}
            placeholder='Insert Movie Title'
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleSearch.bind(this)}/>
          <a className="waves-effect waves-light btn" onClick={() => this.handleSearch.bind(this)('clicked')}>search</a>
          <h5 id="movNotInColl" style={{display: 'none', color:"red"}}>{this.state.search} doesn't match anything in your collection</h5>
        </div>
        {results}
        <MovieList 
          movies={this.state.movies}
          change={this.props.change.bind(this)}
          view={this.props.view}
        />
      </div>
    )
  }
}

//window.MyRatings = MyRatings;

export default MyRatings;