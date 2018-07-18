var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var database = require('./db');
const populate = require('./tools/populate')
var indexRouter = require('./routes/index');

const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function extractProfile (profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    userId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    image: imageUrl
  };
}

passport.use(new GoogleStrategy({
  clientID: '200870884769-upque7vladu4oh6bqd05dheqiulnmjnb.apps.googleusercontent.com',
  clientSecret: 'tyeha77sUE36jMr6GIOIcqxa',
  callbackURL: 'http://localhost:3000/auth/google/callback',
  accessType: 'offline'
}, (token, refreshToken, profile, done) => {
  process.nextTick(function() {
    const data = extractProfile(profile);
    const db = database.get();
    const userCollection = db.collection('users');

    userCollection
      .findOne({ userId: data.userId })
      .then(async existing => {
        if (existing) {
          return done(null, existing);
        } else {
          await userCollection.insertOne(data);
          return done(null, data);
        }
      })
      .catch(e => console.error(e))
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  const db = database.get();
  const userCollection = db.collection('users');

  userCollection.findOne({ userId: obj.userId }, (err, data) => {
    done(null, data);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'anything' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

database.connect('mongodb://localhost:27017/office-map', 'office-map', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
  } else {
    console.log('database connected!');
    populate();
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
