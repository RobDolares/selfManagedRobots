const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

// get a reference to Schema
const Schema = mongoose.Schema;

// create a schema for a user
const userSchema = mongoose.Schema({
  address: {
    city: String,
    country: String
  },
  avatar: String,
  company: String,
  email: String,
  id: Number,
  job: String,
  name: String,
  phone: String,
  skills: [String],
  university: String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

// individual users can authenticate their passwordHash
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// static method to authenticate a user
userSchema.statics.authenticate = function(email, password) {
  return (
    User.findOne({
      email: email
    })
    // validate the user's password
    .then(user => {
      if (user && user.validatePassword(password)) {
        return user;
      } else {
        return null;
      }
    })
  );
  //.then(user => console.log('matched user: ', user));
};

// create a model for a User
const User = mongoose.model('User', userSchema);

module.exports = User;
