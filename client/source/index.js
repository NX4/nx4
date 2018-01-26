import axios from 'axios';
import * as d3 from 'd3';
import { filter } from 'lodash';
import './style.scss';

console.log(__ENV__);

/** --- DIMENSIONS + MISC --- */
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = d3.select('#chart_container').node().getBoundingClientRect().width - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

const brushHeight = d3.select('#brush-container').node().getBoundingClientRect().height - margin.top - margin.bottom;

const canvas = d3.select('#container')
  .append('canvas')
  .attr('width', width)
  .attr('height', height);

const customBase = document.createElement('custom');
const custom = d3.select(customBase);

const aminos = ['A', 'C', 'T', 'G', 'N'];
let squareWidth = 0;

/** --- SCALES --- */
const yScale = d3.scaleOrdinal()
  .domain(aminos)
  .range([0, 25, 50, 75, 100]);

const xScale = d3.scaleLinear()
  .range([0, width]);

const x2 = d3.scaleLinear();

const color = d3.scaleLinear()
  .domain([0, 100])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

const lineScaleY = d3.scaleLinear()
  .domain([0, 2]) // TODO, depends on base of LOG used for entropy
  .range([brushHeight - 0, 0]);

/** --- AXES --- */
const xAxisContext = d3.axisBottom(x2);
const yAxisContext = d3.axisLeft(lineScaleY).ticks(2);

/** --- INITIALIZE DATA VARS --- */

let gData = [];
let entropyData = [];

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

function init() {
  const seqLength = entropyData.length;
  x2.domain([0, seqLength])
    .range([0, width]);

  squareWidth = width / seqLength;
  const line = d3.line()
    .x(function(d, i) { return x2(i); })
    .y(function (d) { return lineScaleY(d.e); });

  // Context SVG (top brush)
  const contextContainer = d3.select('#brush-container');

  const contextContainerSvg = contextContainer.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', brushHeight + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const brush = d3.brushX()
    .extent([[0, 0], [width, brushHeight]])
    .on('end', brushed);

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
    .attr('class', 'axis axis--x')
    // .attr('transform', `translate(0, ${brushHeight})`)
    .call(yAxisContext);

  contextContainerSvg.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, xScale.range());

}

function rangeData(p1, p2) {
  // const nData = filter(gData, function(i) { return (i.pos > p1 && i.pos < p2); });
  const nData = filter(gData, o => { return (o.pos > p1 && o.pos < p2); });
  return nData;
}

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

axios.get('api/entropy')
  .then((response) => {
    gData = response.data[0];
    entropyData = response.data[1];
    console.log('max: ', d3.max(entropyData, function (d) { return d.e; }));
    console.log('mean: ', d3.min(entropyData, function (d) { return d.e; }));
    console.log('median: ', d3.median(entropyData, function (d) { return d.e; }));
    init();
  });
