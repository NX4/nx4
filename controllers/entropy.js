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
    })
}

function applyPercentage(obj) {
    return new Promise(resolve => {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const val = obj[keys[i]] / fastaTotal;
            obj[keys[i]] = Math.round(val * 100);
        }
        resolve(obj);
    })
}

function parseData(array) {
    return new Promise(resolve => {
        const response = [];
        const entropy = [];
        for (let i = 0; i < array[0].length; i++) {
            const obj = {
                A: 0, C: 0, G: 0, T: 0, N: 0
            };
            for (let t = 0; t < array.length; t++) {
                obj[array[t].charAt(i)] += 1;
            }
            applyPercentage(obj).then(pObj => {
                const cEntropy = [];
                let vEntropy = 0;
                const oKeys = Object.keys(pObj);
                for (let l = 0; l < oKeys.length; l++) {
                    const key = Object.keys(pObj)[l];
                    const res = { pos: i, type: key, value: obj[key] };
                    if (obj[key] !== 0) {
                        vEntropy += ( (obj[key]/100) * Math.log2(obj[key]/100) );
                    }
                    response.push(res);
                }
                entropy.push({i, e: vEntropy * -1});
            })
        }
        resolve([response, entropy]);
    })
}

function init() {
    return new Promise(resolve => {
        fs.readFile(`${__dirname}/data/MuV-MDPH.aligned.pruned.fasta`, 'utf8', (err, data) => {
            if (err) {
                return console.log(err);
            }
            const seqs = fastaParser.parse(data);
            fastaTotal = seqs.length;
            arraySeqs(seqs).then(arr => {
                parseData(arr).then( (res) => {
                    console.log(`All ${res[0].length} positions done`);
                    resolve(res);
                })
            })
        })
    })

}

module.exports = init;
