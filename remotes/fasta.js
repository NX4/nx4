const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  controllers.fasta().then(responce => {
    res.send(responce);
  })
});

module.exports = router;