const express = require('express');
const memoize = require('memoizee');
const controllers = require('../controllers');

const router = express.Router();

const getDataCache = memoize(controllers.entropy, { length: 1 }, { promise: true });

router.get('/', (req, res) => {
    getDataCache().then(responce => {
        res.send(responce);
    })
});

module.exports = router;