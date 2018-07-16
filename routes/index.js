var express = require('express');
var router = express.Router();
var database = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  const db = database.get();
  const userCollection = db.collection('users');
  const pinCollection = db.collection('pins');
  let pins, users;

  pinCollection.find().toArray()
    .then(_pins => pins = _pins)
    .then(() => userCollection.find().toArray())
    .then(_users => users = _users)
    // .then(() => console.log(users))
    .then(() => res.render('index', { title: 'Map',  users: users, pins: pins }))
    .catch(e => console.error(e))
});

router.get('/example', function(req, res, next) {
  res.send('hallo');
});

module.exports = router;
