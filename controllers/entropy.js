const fastaParser = require('biojs-io-fasta');
const fs = require('fs');

// Define globals
let fastaTotal;

function arraySeqs(seqs) {
  return new Promise(resolve => {
    const arr = [];
    for (let i = 0; i < seqs.length; i++) {
      arr.push(seqs[i].seq);
    }
    resolve(arr);
  });
}

function applyPercentage(obj, gaps, ambi) {
  return new Promise(resolve => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const val = obj[keys[i]] / (fastaTotal - (gaps + ambi));
      obj[keys[i]] = Math.round(val * 100);
    }
    resolve(obj);
  });
}

function parseData(array) {
  return new Promise(resolve => {
    const positionData = [];
    const entropy = [];
    const gapsArr = [];
    for (let i = 0; i < array[0].length; i++) {
      const obj = {
        A: 0,
        C: 0,
        G: 0,
        T: 0,
        N: 0
      };
      let gaps = 0;
      let ambiguity = 0;
      for (let t = 0; t < array.length; t++) {
        if (array[t].charAt(i) == '-') {
          gaps += 1;
        } else if (Object.keys(obj).indexOf(array[t].charAt(i)) === -1) {
          ambiguity += 1;
        } else {
          obj[array[t].charAt(i)] += 1;
        }
      }
      if (gaps > 0) {
        gapsArr.push({ pos: i, gaps });
      }
      applyPercentage(obj, gaps, ambiguity).then(pObj => {
        const cEntropy = [];
        let vEntropy = 0;
        const oKeys = Object.keys(pObj);
        for (let l = 0; l < oKeys.length; l++) {
          const key = Object.keys(pObj)[l];
          const res = { pos: i, type: key, value: obj[key] };
          if (obj[key] !== 0) {
            vEntropy += obj[key] / 100 * Math.log2(obj[key] / 100);
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
      fastaTotal = seqs.length;
      arraySeqs(seqs).then(arr => {
        parseData(arr).then(res => {
          console.log(res.length);
          console.log(`All ${res[0].length} positions done`);
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
        return console.log(err);
      }
      const seqs = fastaParser.parse(data);
      fastaTotal = seqs.length;
      arraySeqs(seqs).then(arr => {
        parseData(arr).then(res => {
          console.log(file, res.length, `All ${res[0].length} positions done`);
          resolve(res);
        });
      });
    });
  });
}

module.exports = init;
