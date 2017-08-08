const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash-messages');
const Routes = require('./routes/routes');

// require stuff for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// create express app
const app = express();

// setup mongoose
const mongoose = require('mongoose');
// bluebird is a promise library. checkout bluebirdjs.org
// set mongoose's promise library to be bluebird
mongoose.Promise= require('bluebird');

const User = require('./models/user');



// configure passport
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log('LocalStrategy', username, password);
    User.authenticate(username, password)
      // success!!
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      // there was a problem
      .catch(err => done(err));
  })
);

// store the user's id in the session
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user.id);
});

// get the user from the session based on the id
passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  User.findById(id).then(user => done(null, user));
});

// tell express to use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: 'keyboard kitten',
    resave: false,
    saveUninitialized: true
  })
);

//static files
app.use(express.static('public'));

// connect passport to express boilerplate
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', Routes);


// connect to mongo via mongoose
mongoose.connect('mongodb://localhost:27017/robots', { useMongoClient: true })
  // now we can do whatever we want with mongoose.
  // configure session support middleware with express-session
  .then(() => app.listen(3000, () => console.log('ready to roll!!')));
