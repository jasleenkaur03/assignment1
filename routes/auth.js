var express = require('express');
const passport = require('passport');
const { routes } = require('../app');
const user = require('../Models/user');
var router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { err: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  }));

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
})

router.get('/demoaccount', function (req, res, next) {
  const newDemoUser = new user({
    username: "jasleenkaur@gmail.com",
    password: "Jasleen@2002"
  });
  newDemoUser.save().then(() => { console.log("account created") }).catch((err) => { console.log(err) });
  res.send("Demo account created");
});

module.exports = router;
