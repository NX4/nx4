const express = require('express');
const memoize = require('memoizee');
const controllers = require('../controllers');

const router = express.Router();

const getDataCache = memoize(controllers.entropy, { primitive: true }, { promise: true });

router.get('/:file', (req, res) => {
    getDataCache(null, req.params.file).then(responce => {
        res.send(responce);
    })
});

module.exports = router;