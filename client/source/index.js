import { get as fetch } from 'axios';
import { select } from 'd3';
import { getState, dispatch, observe } from './store';
import './style.scss';
// import logo from './img/nx4_logo.svg';

import Context from './modules/context';
import Focus from './modules/focus';
import Alignment from './modules/alignment';

const contextChart = Context();
const focusChart = Focus();
const alignmentChart = Alignment();

/** --- INITIALIZE DATA VARS --- */
let gData = [];
let entropyData = [];

/** --------- INIT --------- */
function init() {
  select('#brush-container').datum(entropyData).call(contextChart);
  select('#overview-container').datum(entropyData).call(focusChart);
  select('#alignment-container').datum(gData).call(alignmentChart);
}


fetch('api/entropy')
  .then((response) => {
    gData = response.data[0];
    entropyData = response.data[1];
    init();
  });
