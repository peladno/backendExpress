const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../model/login.model");

//Passport config

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      } else {
        return done(null, user, { message: "Logged in successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (user) {
          return done(null, false, { message: "User already exists" });
        }
        const newUser = await User.create({
          username,
          password,
          name: req.body.name,
        });
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//Routes
router.get("/", (req, res) => {
  if (req.user?.username) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login",passport.authenticate("login"), async (req, res) => {
  res.send("signup succedully");
  
});

router.get("/login-failure", (req, res) => {
  res.render("login-failure");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.send({ message: "User already exists" });
    }
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
    });
    res.send({user:newUser});
  } catch (err) {
  console.log(err);
  }
});

router.get("/signup-failure", (req, res) => {
  res.render("signup-failure");
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
}

router.get("/home", checkAuthentication, (req, res) => {
  res.render("home", { user: req.user?.name });
});

router.get("/fired", (req, res) => {
  res.render("logout", {
    user: req.user?.name,
  });
});

router.get("/logout", (req, res) => {
  if (req.user?.username) {
    req.session.destroy((err) => {
      if (!err) res.redirect("/");
      else res.send({ status: "Logout ERROR ", body: err });
    });
  }
});

router.get("/user", checkAuthentication, (req, res) => {
  res.send({ user: req.user?.name });
});

module.exports = router;
