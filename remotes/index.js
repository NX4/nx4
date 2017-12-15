const express = require('express');

const router = express.Router();

router.use('/health', require('./health'));
router.use('/fasta', require('./fasta'));

module.exports = router;
