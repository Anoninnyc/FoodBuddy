const db = require('../dbConnection');

// create friendRequest model
const allRequest = db.Model.extend({
  tableName: 'allRequests',
  hasTimestamps: true
});

module.exports = allRequest;
