const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Daos
const mongoDAO = require("../daos/mongoDAO");
const DAO = new mongoDAO();

//Password encrypted

const rounds = 10;

const hashPassword = (password, rounds) => {
  const hash = bcrypt.hashSync(password, rounds,(err, hash) => {
    if (err) {
      console.error(err);
      return err;
    }
    return hash;
  });
  return hash;
};

const comparePassword = (password, hash) => {
  const bool = bcrypt.compareSync(password, hash, (err, res) => {
    if (err) {
      console.error(err);
      return false;
    }
    return res;
  });
  return bool;
};

//Passport config

passport.use(
  "login",
  new LocalStrategy(async function (username, password, done) {
    let user;
    try {
      user = await DAO.getByID(username);
    } catch (err) {
      throw done(err);
    }
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    const bool = comparePassword(password, user.password);
    if (bool === false) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

passport.use(
  "signup",
  new LocalStrategy({ passReqToCallback: true }, async function (
    req,
    username,
    password,
    done
  ) {
    let newUser;
    try {
      newUser = await DAO.getByID(username);
    } catch(err) {
      throw done(err);
    }
    if (newUser) {
      return done(null, false, { message: "Username already exists." });
    }
    const hash = hashPassword(password, rounds);
    try {
      newUser = { username, password: hash, name: req.body.name };
      await DAO.save(newUser);
    } catch(err) {
      throw done(err);
    }
    return done(null, newUser);
  })
);

passport.serializeUser((username, done) => {
  done(null, username.name);
});

passport.deserializeUser(async (name, done) => {
  let user;
  try {
    user = await DAO.getByID(name);
  } catch(err) {
    throw done(err);
  }
  done(null, user);
});

//Routes

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/login-failure",
  })
);

router.get("/login-failure", (req, res) => {
  res.render("login-failure");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/home",
    failureRedirect: "/signup-failure",
  })
);

router.get("/signup-failure", (req, res) => {
    res.render("signup-failure");
})

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
}

router.get('/home', checkAuthentication, (req, res) => {
    res.render('home', {user: req.user.name})
})

router.get('/fired', (req, res) => {
    res.render('logout', {
        nombre: req.user.name
    });
});


router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router;
