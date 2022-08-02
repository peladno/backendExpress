const express = require("express");
const router = express.Router();
const DAO = require("../daos/mongoDAO");

//TODO routes para login y signup

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/login", (req, res) => {
  const user = req.session?.user;
  if (user) {
    res.redirect("/");
  } else {
    res.status(401).render("index")
  }
});

router.get("/logout", (req, res) => {
  const user = req.session?.user;

  if (user) {
    req.session.destroy((err) => {
      if (!err) {
        res.render("logout",{user});
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post('/login', async (req, res) => {
  req.session.user = req.body.user;
  res.redirect('/home')
})
module.exports = router;
