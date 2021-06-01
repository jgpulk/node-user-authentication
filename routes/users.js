const express = require("express");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate')
const flash = require('connect-flash');

var router = express.Router();

var User = require("../models/user")
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/users/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id,
      name: profile.displayName,
      provider: profile.provider
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/users/auth/facebook/home"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      facebookId: profile.id,
      provider: profile.provider,
      name: profile.displayName
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/home',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users/home');
  });

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/home',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users/home');
  });

router.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("auth started");
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          console.log(err);
        }
        if (!user) {
          console.log("info :" + info.message);
          req.flash('loginError', 'password or username is incorrect')
          res.redirect('/');
        }
        req.logIn(user, function(err) {
          if (err) {} else {
            res.redirect('/users/home');
          }
        });
      })(req, res);
    }
  });
})

router.get("/register", function(req, res) {
  res.render("register", {
    messages: req.flash('registerError')
  })
})

router.post("/register", function(req, res) {
  User.register({
    username: req.body.username,
    name: req.body.name
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err.message);
      req.flash('registerError', err.message)
      res.redirect("/users/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        // console.log(user);
        res.redirect("/users/home");
      });
    }
  });

})

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.get("/home", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("home", {
      user: req.user
    })
  } else {
    res.redirect("/")
  }
})

module.exports = router;
