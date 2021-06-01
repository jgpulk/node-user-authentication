require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const flash = require('connect-flash');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/nodeauth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


//models


//routes
const routes = require("./routes/index.js")
const users = require("./routes/users.js")
app.use("/", routes)
app.use("/users", users)

app.listen(3000, function() {
  console.log('server started at 3000');
})
