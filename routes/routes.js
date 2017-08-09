const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// this middleware function will check to see if we have a user in the session.
// if not, we redirect to the login form.
// const requireLogin = (req, res, next) => {
//   console.log('req.user', req.user);
//   if (req.user) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// };
// routes.get('/', requireLogin, (req, res) => {
//   res.render('home', { user: req.user });
// });

routes.get('/', (req, res) => {
  User.find()
    .then((data) => {res.render('home', {users: data});
    })
})

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

  user
    .save()
    // if good...
    .then(() => res.redirect('/'))
    // if bad...
    .catch(err => console.log(err));
});

//Employed Robots//

routes.get('/employed',(req, res)=>{
  User.find({job: {$ne: [null]}})
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
