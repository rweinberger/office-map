var express = require('express');
var router = express.Router();
var database = require('../db.js');
const passport = require('passport');
const { google } = require('googleapis');
const plus = google.plus('v1');
const { OAuth2Client } = require('google-auth-library');

const client_id = "200870884769-upque7vladu4oh6bqd05dheqiulnmjnb.apps.googleusercontent.com";
const authClient = new OAuth2Client(client_id);

router.get('/', function(req, res, next) {
  const db = database.get();
  const userCollection = db.collection('users');
  const pinCollection = db.collection('pins');
  const user = req.user ? req.user : false;
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
    .then(() => userCollection.find().toArray())
    .then(_users => users = _users)
    .then(() => res.render('index', { title: 'Map', user: user, pins: pins }))
    .catch(e => console.error(e))
});

router.post('/new_pin', function(req, res, next) {
  const date = new Date(Date.now());
  const pin = {
    userId: req.user.userId,
    userName: req.user.displayName,
    text: req.body.text,
    location: req.body.location,
    left: req.body.left,
    top: req.body.top,
    date: date.toISOString()
  };
  addNewPin(pin, res);
});

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/'
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// this code doesn't work :'(
router.get('/signin', function(req, res, next) {
  const token = req.body.idtoken;
  async function verifyAndSignIn() {
    const ticket = await authClient.verifyIdToken({
        idToken: token,
        audience: client_id
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const db = database.get();
    const userCollection = db.collection('users');

    userCollection
      .findOne({ userId: userId })
      .then(async data => {
        if (!data) {
          currentUser = {
            userId: userId,
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            pins: []
          }
          await userCollection.insertOne(currentUser);
          passport.authenticate('google', { scope: ['email', 'profile'] })
          res.send('ok');
        }
      });
  }
  verifyAndSignIn().catch(console.error);
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

