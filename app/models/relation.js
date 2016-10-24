const db = require('../dbConnection');
const User = require('./user');

// create user relationship model
const Relation = db.Model.extend({
  tableName: 'relations',
  user1: () => (
     this.belongsTo(User, 'user1id')
  ),
  user2: () => (
     this.belongsTo(User, 'user2id')
  )
});

module.exports = Relation;
