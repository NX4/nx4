const fastaParser = require('biojs-io-fasta');
const fs = require('fs');
const log = require('log-util');

function arraySeqs(seqs) {
  return new Promise(resolve => {
    const arr = [];
    for (let i = 0; i < seqs.length; i++) {
      arr.push({ seq: seqs[i].seq, id: seqs[i].id });
    }
    resolve(arr, seqs.length);
  });
}

function applyPercentage(obj, gaps, ambi, total) {
  return new Promise(resolve => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const val = obj[keys[i]].count / (total - (gaps + ambi));
      obj[keys[i]].count = Math.round(val * 100);
    }
    resolve(obj);
  });
}

function parseData(array, fTotal) {
  return new Promise(resolve => {
    const positionData = [];
    const entropy = [];
    const gapsArr = [];
    for (let i = 0; i < array[0].seq.length; i++) {
      const obj = {
        A: {count: 0, seqs: []},
        C: {count: 0, seqs: []},
        G: {count: 0, seqs: []},
        T: {count: 0, seqs: []},
        N: {count: 0, seqs: []},
      };
      let gaps = 0;
      let ambiguity = 0;
      for (let t = 0; t < array.length; t++) {
        if (array[t].seq.charAt(i) == '-') {
          gaps += 1;
        } else if (Object.keys(obj).indexOf(array[t].seq.charAt(i)) === -1) {
          ambiguity += 1;
        } else {
          obj[array[t].seq.charAt(i)].count += 1;
          obj[array[t].seq.charAt(i)].seqs.push(array[t].id);
        }
      }
      if (gaps > 0) {
        gapsArr.push({ pos: i, gaps });
      }
      applyPercentage(obj, gaps, ambiguity, fTotal).then(pObj => {
        let vEntropy = 0;
        const oKeys = Object.keys(pObj);
        for (let l = 0; l < oKeys.length; l++) {
          const key = Object.keys(pObj)[l];
          const res = { pos: i, type: key, value: obj[key].count, seqs: obj[key].count === 100 ? [] : obj[key].seqs };
          if (obj[key].count !== 0) {
            vEntropy += obj[key].count / 100 * Math.log2(obj[key].count / 100);
          }
          positionData.push(res);
        }
        entropy.push({ i, e: vEntropy * -1 });
      });
    }
    resolve([positionData, entropy, gapsArr]);
  });
}

function init(data, file) {
  if (data && data !== null) {
    return new Promise(resolve => {
      const seqs = fastaParser.parse(data);
      const fastaTotal = seqs.length;
      arraySeqs(seqs).then(arr => {
        parseData(arr, fastaTotal).then(res => {
          log.debug(`All ${res[0].length} positions done`);
          resolve(res);
        });
      });
    });
  }
  return new Promise(resolve => {
    let filePath;
    if (file == 'ebola') {
      filePath = `${__dirname}/data/171020-KGA_RAxML_bipartitions.ebov_alignment_red.fasta`;
    }
    if (file == 'muv') {
      filePath = `${__dirname}/data/MuV-MDPH.aligned.pruned.fasta`;
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return log.error(err);
      }
      const seqs = fastaParser.parse(data);
      fastaTotal = seqs.length;
      parseData(seqs).then(res => {
        log.debug(file, `All ${res[0].length} positions done`);
        resolve(res);
      });
    });
  });
}

module.exports = init;
