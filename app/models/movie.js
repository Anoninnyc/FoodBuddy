const db = require('../dbConnection')
const Rating = require('./rating');

const Movie = db.Model.extend({
  tableName: 'movies',
  rating: function() {
    return this.hasMany(Rating);
  },
});

module.exports = Movie;
