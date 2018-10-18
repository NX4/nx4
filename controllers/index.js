const fasta = require('./fasta');
const entropy = require('./entropy');
const memoize = require('memoizee');

const getDataCache = memoize(entropy, { primitive: true }, { promise: true });

module.exports = {
  fasta,
  entropy
}