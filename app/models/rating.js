const db = require('../dbConnection');
const User = require('./user');
const Movie = require('./movie');

// create rating model
const Rating = db.Model.extend({
  tableName: 'ratings',
  user: function() {
    return this.belongsTo(User, 'userid');
  },
  movie: function() {
    return this.belongsTo(Movie, 'movieid');
  },
  hasTimestamps: true
});

module.exports = Rating;
