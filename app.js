require('dotenv').config();

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const express        = require('express');
const favicon        = require('serve-favicon');
const hbs            = require('hbs');
const mongoose       = require('mongoose');
const logger         = require('morgan');
const path           = require('path');
const session        = require("express-session");
const bcrypt         = require("bcrypt");
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const User           = require("./models/user");


mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

//session
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';




passport.serializeUser((user, cb) => {
  console.log("serialize: ", user);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById( id, (err, user) => {
    console.log("deserialize: ", user);
    cb(null, user);
  });
});


passport.use(new LocalStrategy({
  passReqToCallback: true
  },(req, username, password, next) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect email" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    // console.log("myUser before: ", myUser)
    // myUser = username;
    // console.log("myUser after: ", myUser);

    return next(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());

const index  = require('./routes/index');
const auth   = require('./routes/authRoutes');
const post   = require('./routes/postRoutes');
const thread = require('./routes/threadRoutes');
const comment = require('./routes/commentRoutes');
const profile = require('./routes/profileRoutes');
app.use('/', index);
app.use('/', auth);
app.use('/', post);
app.use('/', thread);
app.use('/', comment);
app.use('/', profile);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
