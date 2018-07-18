var express = require('express');
var router = express.Router();
var database = require('../db.js');

router.get('/', function(req, res, next) {
  const db = database.get();
  const userCollection = db.collection('users');
  const pinCollection = db.collection('pins');
  let pins, users;

  pinCollection.find().toArray()
    .then(_pins => {
      _pins.forEach(pin => {
        const date = new Date(pin.date);
        pin.year = date.getFullYear();
        pin.month = date.getMonth() + 1;
        pin.day = date.getDate();
        pin.hour = date.getHours();
        pin.minute = (date.getMinutes()<10?'0':'') + date.getMinutes();
      })
      pins = _pins
    })
    // .then(() => {
    //   console.log(pins[0].date);
    //   console.log(pins[0].date.getHours());
    //   console.log(pins[pins.length-1].date);
    //   const date = new Date(pins[pins.length-1].date);
    //   console.log(date.getHours());
    // })
    .then(() => userCollection.find().toArray())
    .then(_users => users = _users)
    .then(() => res.render('index', { title: 'Map',  users: users, pins: pins }))
    .catch(e => console.error(e))
});

router.post('/new_pin', function(req, res, next) {
  const date = new Date(Date.now());
  const pin = {
    userId: req.body.userId,
    text: req.body.text,
    location: req.body.location,
    left: req.body.left,
    top: req.body.top,
    date: date.toISOString()
  };
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
    .then(() => {
      pin._id = id;
      res.send(pin);
    })
    .catch(e => console.error(e))
}

module.exports = router;

