const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// this middleware function will check to see if we have a user in the session.
// if not, we redirect to the login form.
const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.get('/', requireLogin, (req, res) => {
  User.find()
  .then((data)=>{res.render
res.render('home', {
    user: req.user,
    users: data
  });
  })
});

routes.get('/login', (req, res) => {
  res.render('loginForm', {failed: req.query.failed});
});

routes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureFlash: true
  })
);

//Registration//

routes.get('/register', (req, res) => {
  res.render('registrationForm');
});

routes.post('/regSubmit', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
    // if good...
    .then(() => res.redirect('/'))
    // if bad...
    .catch(err => console.log(err));
});

// Update information

routes.get('/edit', (req, res) => {
  console.log(req.query.id);
  if (req.query.id) {
    User.findById(req.query.id)
    .then(data => res.render('editprofile', {user: data}))
  } else {
    console.log('Edit attempt failed');
    res.redirect('/');
  }
});

routes.post('/update', (req, res) => {
  if (req.body.id) {
    User.findByIdAndUpdate(req.body.id, req.body, { upsert: true })
    .then(() => res.redirect('/'));
  }

});

//Employed Robots//

routes.get('/employed',(req, res)=>{
  User.find({job: {$nin: [null]}})
  .then((data)=>{res.render('employed', {users: data});
  })
})

//Unemployed Robots//

routes.get('/unemployed', (req, res) => {
  User.find({job: null})
    .then((data) => {res.render('unemployed', {users: data});
    })
})

//Individual User Bio//

routes.get('/bio/:username', (req, res) => {
  User.find({username:req.params.username})
    .then((data) => {res.render('bio', {users: data});
    })
});

// log out!!!!!

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = routes;
