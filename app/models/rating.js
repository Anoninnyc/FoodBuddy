const db = require('../dbConnection');
const User = require('./user');
const Movie = require('./movie');

// create rating model
const Rating = db.Model.extend({
  tableName: 'ratings',
  user: () => (
   this.belongsTo(User, 'userid')
  ),
  movie: () => (
   this.belongsTo(Movie, 'movieid')
  ),
  hasTimestamps: true
});

module.exports = Rating;
