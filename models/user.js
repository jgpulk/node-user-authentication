const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  provider: String
});
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const User = module.exports = mongoose.model('User', UserSchema)
