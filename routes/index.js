var express = require('express');
var router = express.Router();
var database = require('../db.js');

router.get('/', function(req, res, next) {
  const db = database.get();
  const userCollection = db.collection('users');
  const pinCollection = db.collection('pins');
  let pins, users;

  pinCollection.find().toArray()
    .then(_pins => pins = _pins)
    .then(() => userCollection.find().toArray())
    .then(_users => users = _users)
    .then(() => res.render('index', { title: 'Map',  users: users, pins: pins }))
    .catch(e => console.error(e))
});

router.post('/new_pin', function(req, res, next) {
  const pin = {
    userId: req.body.userId,
    text: req.body.text,
    location: req.body.location
  }
  addNewPin(pin, res);
});

const addNewPin = (pin, res) => {
  const db = database.get();
  const userCollection = db.collection('users');
  const pinCollection = db.collection('pins');
  let id;

  pinCollection.insertOne(pin)
    .then(data => id = data.ops[0]._id)
    .then(() => userCollection.findOneAndUpdate({userId: parseInt(pin.userId)}, {$push: {pins: id}}))
    .then(data => console.log(data))
    .then(() => res.redirect('/'))
    .catch(e => console.error(e))
}

module.exports = router;
