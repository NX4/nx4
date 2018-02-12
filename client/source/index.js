import axios from 'axios';
import * as d3 from 'd3';
import { filter } from 'lodash';
import { getState, dispatch, observe } from './store';
import actions from './actions/index';
import './style.scss';

import Context from './modules/context';
import Focus from './modules/focus';

// console.log(__ENV__);
const lineChart = Context();
const focusChart = Focus();

/** --- DIMENSIONS --- */

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// TO DO: hardcoded '200' value is not idea
const width = d3.select('#chart_container').node().getBoundingClientRect().width - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

const aminos = ['A', 'C', 'T', 'G', 'N'];
let squareWidth = 0;

/** --- SCALES --- */
const yScale = d3.scaleOrdinal()
  .domain(aminos)
  .range([0, 25, 50, 75, 100]);

const xScale = d3.scaleLinear()
  .range([0, width]);

// const color = d3.scaleLinear()
//   .domain([0, 100])
//   .interpolate(d3.interpolateHcl)
//   .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

const color = d3.scaleLinear()
  .domain([1, 50, 99])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#f3cbd3'), d3.rgb('#6c2167'), d3.rgb('#f3cbd3')]);

/** --- INITIALIZING CHART CONTAINERS --- */
const canvas = d3.select('#container')
  .append('canvas')
  .attr('width', width)
  .attr('height', height);

d3.select('#container').style('margin-left', margin.left);

const customBase = document.createElement('custom');
const custom = d3.select(customBase);


/** --- INITIALIZE DATA VARS --- */
let gData = [];
let entropyData = [];


/** --------- DATA BINDING --------- */

function databind(data) {
  const join = custom.selectAll('custom.rect')
    .data(data);

  const enterSel = join.enter()
    .append('custom')
    .attr('class', 'rect')
    .attr('x', 0)
    .attr('y', function(d) {
      return yScale(d.type);
    })
    .attr('fillStyle', (d) => {
      if (d.value < color.domain()[0] || d.value > color.domain()[2]) {
        return '#E0E0E0';
      } return color(d.value);
    })
    .attr('width', 0)
    .attr('height', 0);
  join
    .merge(enterSel)
    .transition()
    .attr('x', function(d) {
      return xScale(d.pos);
    })
    .attr('width', squareWidth)
    .attr('height', 20)
    .attr('fillStyle', (d) => {
      if (d.value < color.domain()[0] || d.value > color.domain()[2]) {
        return '#E0E0E0';
      } return color(d.value);
    });

  const exitSel = join.exit()
    .transition()
    .attr('width', 0)
    .attr('height', 0)
    .remove();
}


/** --------- DRAWING TO CANVAS --------- */

function draw(_canvas) {
  const context = _canvas.node().getContext('2d');
  context.clearRect(0, 0, width, height);
  const elements = custom.selectAll('custom.rect');

  elements.each(function(d,i) {
    const node = d3.select(this);
    context.fillStyle = node.attr('fillStyle');
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
  });
}


/** --------- INIT --------- */
// TO DO: 'init' is a very generic name, all of this basically
// draws graphics. Consider another name?

function init() {
  d3.select('#brush-container').datum(entropyData).call(lineChart);
  d3.select('#overview-container').datum(entropyData).call(focusChart);

  // Global event handling
  const unsubscribe = observe(state => state.context, (state, nextSate) => {
    const lower = Math.round(state.range[0]);
    const upper = Math.round(state.range[1]);

    squareWidth = width / (upper - lower);
    xScale.domain(state.domain);

    const newData = rangeData(lower, upper); // eslint-disable-line

    databind(newData);
    const t = d3.timer((elapsed) => {
      draw(canvas);
      if (elapsed > 600) t.stop();
    });
  });
} // init()

function rangeData(p1, p2) {
// TODO FIX SINTAX const nData = filter(gData, function(i) { return (i.pos > p1 && i.pos < p2); });
  const nData = filter(gData, o => { return (o.pos > p1 && o.pos < p2); });
  return nData;
}

axios.get('api/entropy')
  .then((response) => {
    gData = response.data[0];
    entropyData = response.data[1];
    init();
  });
