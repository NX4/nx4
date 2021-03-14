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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

