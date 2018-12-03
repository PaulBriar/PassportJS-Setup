const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');
const port = 3000;

mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-session')({
  secret: "Rusty is the best",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//Routes
//================

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

//Auth Routes
app.get("/register", (req, res) => {
  res.render("register");
});
//Handling user sign up
app.post("/register", (req, res) => {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('register');
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secret");
      });
    }
  });
});

//Login Routes
//Render Login Form
app.get("/login", (req, res) => {
  res.render("login");
});
//Login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,(req, res) => {
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
