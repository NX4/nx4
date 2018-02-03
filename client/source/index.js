import axios from 'axios';
import * as d3 from 'd3';
import { filter } from 'lodash';
import { getState, dispatch } from './store';
import actions from './actions/index';
import './style.scss';

import Context from './modules/context';

console.log(__ENV__);


const lineChart = Context();

/*
--- cAlign Developer notes ---
The interface is composed of:
- context ("brush") - d3
- zoomed area ("overview") - d3
- alignment view ("focus") - d3 + canvas
*/


/** --------- GLOBAL VARS --------- */

/** --- DIMENSIONS --- */

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const brushWidth = d3.select('#brush-container').node().getBoundingClientRect().width - margin.left - margin.right;
const brushHeight = d3.select('#brush-container').node().getBoundingClientRect().height - margin.top - margin.bottom;

const overviewWidth = d3.select('#overview-container').node().getBoundingClientRect().width - margin.left - margin.right;
const overviewHeight = d3.select('#overview-container').node().getBoundingClientRect().height - margin.top - margin.bottom;

// TO DO: change names to something like "focusWidth" etc
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

const x2 = d3.scaleLinear(); // TO DO: clearly not a semantic name

const overviewX = d3.scaleLinear();

const lineScaleY = d3.scaleLinear()
  .domain([0, 2]) // TODO, depends on base of LOG used for entropy
  .range([brushHeight - 0, 0]);

const overviewScaleY = d3.scaleLinear()
  .domain([0, 2]) // TODO, depends on base of LOG used for entropy
  .range([overviewHeight - 0, 0]);

const color = d3.scaleLinear()
  .domain([0, 100])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

const zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [overviewWidth, overviewHeight]])
  .extent([[0, 0], [overviewWidth, overviewHeight]])
  .on('zoom', zoomed);

/** --- AXES --- */

const xAxisContext = d3.axisBottom(x2);
const yAxisContext = d3.axisLeft(lineScaleY).ticks(2);


/** --- GEOMETRY GENERATORS --- */

const line = d3.line()
  .x((d, i) => x2(i))
  .y(d => lineScaleY(d.e));

const overviewLine = d3.line()
  .x((d, i) => overviewX(i))
  .y(d => overviewScaleY(d.e));

/** --- INITIALIZING CHART CONTAINERS --- */

const overviewContainer = d3.select('#overview-container');

const overviewtainerSvg = overviewContainer.append('svg')
  .attr('width', overviewWidth + margin.left + margin.right)
  .attr('height', overviewHeight + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

overviewtainerSvg.append('defs').append('clipPath')
  .attr('id', 'clip')
  .append('rect')
  .attr('width', overviewWidth)
  .attr('height', overviewHeight);

const overview = overviewtainerSvg.append('g')
  .attr('class', 'overview');

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
    .attr('fillStyle', function(d) { return color(d.value); })
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
    .attr('fillStyle', function(d) { return color(d.value); })

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
  setTimeout(() => {
    dispatch(actions.setNombre('Carlos'));
  }, 5000);
  const seqLength = entropyData.length;
  x2.domain([0, seqLength])
    .range([0, width]);

  d3.select('#test-contaner').datum(entropyData).call(lineChart);

  overviewX.domain([0, seqLength])
    .range([0, overviewWidth]);

  squareWidth = width / seqLength;

  // TOP brush
  const contextContainer = d3.select('#brush-container');

  const contextContainerSvg = contextContainer.append('svg')
    .attr('width', brushWidth + margin.left + margin.right)
    .attr('height', brushHeight + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const brush = d3.brushX()
    .extent([[0, 0], [brushWidth, brushHeight]])
    .on('end', brushed)
    .on('brush', brushedForOverview);

  const context = contextContainerSvg.append('g')
    .attr('class', 'mainContext');

  context.append('path')
    .datum(entropyData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  context.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${brushHeight})`)
    .call(xAxisContext);

  context.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxisContext);

  contextContainerSvg.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, xScale.range());

  // MIDDLE 'OVERVIEW'

  overview.append('path')
    .datum(entropyData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('class', 'overviewPath')
    .attr('d', overviewLine);

  overviewtainerSvg.append('rect')
    .attr('class', 'zoom')
    .attr('width', width)
    .attr('height', height)
    .call(zoom);
}

function rangeData(p1, p2) {
  // TODO FIX SINTAX const nData = filter(gData, function(i) { return (i.pos > p1 && i.pos < p2); });
  const nData = filter(gData, o => { return (o.pos > p1 && o.pos < p2); });
  return nData;
}

/* Update the range of the Overview line chart on 'brush' as opposed to
on 'end' to enchance the usability.*/
function brushedForOverview() {
  const s = d3.event.selection;
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  overviewX.domain(s.map(x2.invert, x2));
  overview.select('.overviewPath').attr('d', overviewLine);
  overviewtainerSvg.select('.zoom').call(zoom.transform, d3.zoomIdentity
    .scale(overviewWidth / (s[1] - s[0]))
    .translate(-s[0], 0));
}

/* Update the alingment chart on brush 'end'*/
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  const s = d3.event.selection;
  const newRange = s.map((x2.invert));
  const lower = Math.round(newRange[0]);
  const upper = Math.round(newRange[1]);

  squareWidth = width / (upper - lower);
  xScale.domain(s.map(x2.invert, x2));

  const newData = rangeData(lower, upper);

  databind(newData);
  const t = d3.timer((elapsed) => {
    draw(canvas);
    if (elapsed > 600) t.stop();
  });
}

// TO DO: esto es un desorden! :D .|.
function zoomed() {
  console.log('i is zooming');
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
  const t = d3.event.transform;
  overviewX.domain(t.rescaleX(x2).domain());
  overviewtainerSvg.select('overviewPath').attr('d', line);
  // overview.select(".axis--x").call(xAxis);
  // context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
}

axios.get('api/entropy')
  .then((response) => {
    gData = response.data[0];
    entropyData = response.data[1];
    init();
  });
