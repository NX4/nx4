function arraySeqs(seqs) {
  return new Promise(resolve => {
    const arr = [];
    const seqsLength = seqs.length;
    for (let i = 0; i < seqsLength; i++) {
      arr.push({ seq: seqs[i].seq, id: seqs[i].id });
    }
    resolve(arr, seqsLength);
  });
}

function applyPercentage(obj, gaps, ambi, total) {
  return new Promise(resolve => {
    const keys = Object.keys(obj);
    const keysLength = keys.length;
    for (let i = 0; i < keysLength; i++) {
      if (obj[keys[i]].count !== 0) {
        const val = obj[keys[i]].count / (total - (gaps + ambi));
        obj[keys[i]].count = Math.round(val * 100);
      }
    }
    resolve(obj);
  });
}

function parseData(array, fTotal) {
  return new Promise(resolve => {
    const positionData = [];
    const entropy = [];
    const gapsArr = [];
    const seqLength = array[0].seq.length;
    const totalSeqs = array.length;
    for (let i = 0; i < seqLength; i++) {
      const obj = {
        A: {count: 0, seqs: []},
        C: {count: 0, seqs: []},
        G: {count: 0, seqs: []},
        T: {count: 0, seqs: []},
        N: {count: 0, seqs: []},
      };
      let gaps = 0;
      let ambiguity = 0;
      for (let t = 0; t < totalSeqs; t++) {
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
          const res = { pos: i, type: key, value: obj[key].count, seqs: obj[key].count === 100 ? ['all'] : obj[key].seqs };
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

function init(seqs, file) {
  return new Promise(resolve => {
    const fastaTotal = seqs.length;
    arraySeqs(seqs).then(arr => {
      parseData(arr, fastaTotal).then(res => {
        resolve(res);
      });
    });
  });
}

export default init;
