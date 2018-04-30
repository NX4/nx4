const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ status: 'OK' });
});

module.exports = router;