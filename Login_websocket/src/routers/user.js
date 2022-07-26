const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/login", (req, res) => {
  const user = req.session?.user;
  
  if (user) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(process.cwd(),"/public/index.html"));
  }
});

router.get("/logout", (req, res) => {
  const user = req.session?.user;
  
  if (user) {
    req.session.destroy((err) => {
      if (!err) {
        res.render(path.join(process.cwd(), "/public/views/pages/logout.ejs"), {user});
        setTimeout(() => {
          location.href = '/'
      }, 2000)
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post('/login', async (req, res) => {
  req.session.user = req.body.name;
  res.redirect('/home')
})
module.exports = router;
