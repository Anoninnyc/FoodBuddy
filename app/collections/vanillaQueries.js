const sendReq = 'SELECT requestee, response FROM allrequests WHERE requestor = ? AND requestTyp =' + '"' + 'friend' + '"';
const insertRequest = 'INSERT INTO allrequests SET ?';
const listRequests = requestee => 'Select * FROM allrequests WHERE requestee=' + '"' + requestee + '"' + '' + 'OR requestor =' + '"' + requestee + '"' + '';
const gtfm1 = 'SELECT id FROM users WHERE username = ?';
const gtfm2 = 'SELECT * FROM ratings WHERE userid = ?';
const gtfm3 = 'SELECT title FROM movies WHERE id = ?';
const accept1 = (requestor, requestType, requestee) =>'UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND requestTyp=' + '"' + requestType + '"' + ' AND requestee = ' + '"' + requestee + '"'
const accept2 = (requestor, movie, requestee) =>'UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND movie=' + '"' + movie + '"' + ' AND requestee = ' + '"' + requestee + '"'
const accept3 = 'SELECT id FROM users WHERE username = ?';
const accept4 = 'INSERT INTO relations SET ?';
const decline = (requestor, requestee, addOn)=>'UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + ' AND requestee=' + '"' + requestee + '"' + addOn;
const getFriends1 = 'SELECT username FROM users WHERE id = ?';
const getFriends2 = a =>'SELECT * FROM ratings WHERE userid =' + '"' + a + '"';

module.exports = {
  sendReq,
  insertRequest,
  listRequests,
  gtfm1,
  gtfm2,
  gtfm3,
  accept1,
  accept2,
  accept3,
  accept4,
  decline,
  getFriends1,
  getFriends2,
};
