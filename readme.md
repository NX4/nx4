# NX4
## An alternative to genomic large genomic alignments

### Description
NX4 is a web-based visualization tool for the exploration of aligned viral sequences. The tool was born as an alternative to matrix-based MSA visualizations. Please [visit the user guide](https://nx4.gitbook.io/documentation/) for more information.

### Technologies and dependencies
This web application uses a node.js backend to convert the FASTA file into a suitable format for visualization, and ES6 syntax and modules.  Major dependencies include:

* [D3](https://github.com/d3/d3) (Data visualization)
* [BioJS](https://github.com/biojs/biojs) (FASTA parsing)
* [Redux](https://github.com/reactjs/redux) (State/event manager)


### To explore, extend or use this repo
Download or clone, then `cd` into the `root` and install dependencies with `npm install`.

Also `cd` into /client and execute `npm install`.

To run you must run both the backend and the client servers. Execute `npm run dev` in root and in /client. The client will run in `localhost:8080` and the server in `localhost:8000`