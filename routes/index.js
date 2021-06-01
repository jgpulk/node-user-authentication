const express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("login", {
    messages: req.flash('loginError')
  })
})

module.exports = router;
