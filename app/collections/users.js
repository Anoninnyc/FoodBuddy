const db = require('../dbConnection');
const User = require('../models/user');

// create movies collection
const Users = new db.Collection();
Users.model = User;

module.exports = Users;
