const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.get('/:file', (req, res) => {
    controllers.entropy(null, req.params.file).then(responce => {
        res.send(responce);
    })
});

module.exports = router;