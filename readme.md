# Compounded alignment views
## An alternative to genomic alignment views for long sequences and high sample size

### Description
Compounded alignment views aim to solve the growing problem of analyzing pruned genomic files that have dozens or hundreds of samples and/or represent very long sequences. By implementing a combination of information design techniques and statistical transformations, aligned base-pair FASTA files of any sample size can be “compounded” to only 5 rows (one for each nucleotide and an additional one for the missing values). This reduces cognitive load for the the user, enhances usability and enables richer data explorations.

### Technologies and dependencies
This web application uses a node.js backend to convert the FASTA file into a suitable format for visualization, and ES6 syntax and modules.  Major dependencies include:

* [D3](https://github.com/d3/d3) (Data visualization)
* [BioJS](https://github.com/biojs/biojs) (FASTA parsing)
* [Redux](https://github.com/reactjs/redux) (State/event manager)

### Rationale behind development and features
Many of the current tools for bioinformatic analysis can benefit from the fields of information design, data visualization, human-computer interaction and digital usability. Traditional alignment views overload the working memory of the users, use color palettes that are usually inaccesible for colorblind people and don’t provide effective ways of interacting with long and wide data matrices. Additionally, this tool represents an effort in migrating bioinformatics tools to the web. The tool features:

TODO: add images of tool features

* A color scale suitable for colorblind people (protanope, deuteranope)
* A brushable sequence displaying a measure of Shannon entropy
* A new form of alignment chart that displays percentages of each nucleotide at any given position

### To explore and use this repo
Download or clone, then cd into root folder and install dependencies with `npm install`. Also cd into /client and execute `npm install`.

To run you must run both the backend and the client servers. Execute `npm run dev` in root and in /client. The client will run in `localhost:8080` and the server in `localhost:8000`

The current dataset is: TODO –> ask Shirlee for link to dataset.

### Authors and acknowledgments
This tool was developed by Antonio Solano-Roman (hci, data visualization, usability, front-end) and Carlos Cruz-Castillo (back-end, data/state management and architecture, front-end), with the invaluable advice of Dietmar Offenhuber (information design) and Andrés Colubri (statistical analysis and information design). 

The data was kindly provided by the Sabeti Lab at the Broad Institute of MIT and Harvard.
