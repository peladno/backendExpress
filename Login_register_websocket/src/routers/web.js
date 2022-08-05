const express = require("express");
const router = express.Router();

function webAuth(req, res, next) {
  if (req.session?.user) {
    console.log(req.session.user);
      next()
  } else {
      res.redirect('/login')
  }
}

router.get("/home", webAuth, (req, resolve) => {
  resolve.render("home",{user: req.session.user});
});

module.exports = router;
