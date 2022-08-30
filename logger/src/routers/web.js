const express = require("express");
const router = express.Router();
const path = require("path")
const {
  fork
} = require('child_process')


router.get('/infoProcess', (req, res) => {
  res.render('infoProcess', {
     argument: process.argv,
     directory: process.cwd(),
     idProcess: process.pid,
     nodeVersion: process.version,
     OS: process.platform,
     memory: process.memoryUsage().heapTotal,
     path: process.execPath
  })
})


router.get('/api/random', (req, res) => {
  let quantity = req.query.cant

  if (!quantity) quantity = 100000000
  
  const forked = fork(path.join(path.dirname(''), '/API/randomNumber.js'))
  forked.on('message', msg => {
     if (msg == 'done') {
        forked.send(quantity)
     } else {
        res.send(msg)
     }
  })
})


module.exports = router;
