const express = require("express");
const router = express.Router();

function webAuth(req, res, next) {
  if (req.session?.user) {
      next()
  } else {
      res.redirect('/login')
  }
}

router.get("/home", webAuth, (request, resolve) => {
  resolve.render("home",{user: request.session.user});
});

module.exports = router;
