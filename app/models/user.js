const db = require('../dbConnection');
const Relation = require('./relation');

const User = db.Model.extend({
  tableName: 'users',
  relation: () => (
     this.hasMany(Relation)
  ),

});

module.exports = User;
