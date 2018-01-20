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
            obj[keys[i]] = new Number((obj[keys[i]] / fastaTotal).toFixed(2));
        }
        resolve(obj);
    })
}

function parseData(array) {
    return new Promise(resolve => {
        const response = [];
        var test = [];
        var store = new Number();
        for (let i = 0; i < array[0].length; i++) {
            const obj = {
                A: 0, C: 0, G: 0, T: 0, N: 0
            };
            for (let t = 0; t < array.length; t++) {
                obj[array[t].charAt(i)]++
            }
            applyPercentage(obj).then(pObj => {
                const oKeys = Object.keys(pObj);
                // var test = new Number(0);

                // console.log(pObj);

                //shannon entropy
                //-( (val/100)*Math.log2(val/100) + ... )

                for (let l = 0; l < oKeys.length; l++) {
                    const key = Object.keys(pObj)[l];
                    store = store + obj[key];

                    const res = { pos: i, type: key, value: obj[key] };
                    // const test = 'this is a test';
                    response.push(res);
                }
                console.log(store);
            })
        }
        resolve(response);
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
                // console.log(`Array of ${arr.length} sequence done`)
                console.log('this is a test of the entropy')
                parseData(arr).then(res => {
                    // console.log(`All ${res.length} positions done`);
                    console.log('this is a test of the entropy v2')
                    resolve(res);
                })
            })
        })
    })

}

module.exports = init;
