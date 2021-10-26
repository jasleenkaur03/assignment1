var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Mongoose = require('mongoose');

const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');

const User = require('./Models/user');

var app = express();
const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// MongoDb setup
Mongoose.connect("mongodb+srv://jasleekaur03:assignment2@jasleenkaur.cxcnr.mongodb.net/data?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(express.urlencoded());
app.use(express.json());

// Configure Sessions Middleware
app.use(session({
  secret: 'jasleensecret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done)=> {
  if (user) {
    return done(null, user.id);
  }
  return done(null, false);
});

passport.deserializeUser((id,done) => {
  User.findById(id, (err, user) => {
    if(err) return done(null, false);
    return done(null,user);
  })
});

module.exports = app;
