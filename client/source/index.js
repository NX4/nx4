import axios from 'axios';
import * as d3 from 'd3';
import { filter } from 'lodash';
import './style.scss';

console.log(__ENV__);

/** --- DIMENSIONS + MISC --- */

const width = d3.select('#chart_container').node().getBoundingClientRect().width;
const height = 200;

const brushHeight = 50;

const canvas = d3.select('#container')
  .append('canvas')
  .attr('width', width)
  .attr('height', height);

const customBase = document.createElement('custom');
const custom = d3.select(customBase);

const aminos = ['A', 'C', 'T', 'G', 'N'];

/** --- SCALES --- */

const yScale = d3.scaleOrdinal()
  .domain(aminos)
  .range([0, 25, 50, 75, 100]);

const xScale = d3.scaleLinear()
  .range([0, width]);

const x2 = d3.scaleLinear()
  .domain([0, 15384])
  .range([0, width]);

const color = d3.scaleLinear()
  .domain([0, 1])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

const lineScaleX = d3.scaleLinear()
  .domain([0, 10]) //TODO, CALCULATE length of sequence? (it's not gData.length!)
  .range([0, width]);

const lineScaleY = d3.scaleLinear()
  .domain([0, 2]) //TODO, depends on base of LOG used for entropy
  .range([0, brushHeight - 10]);

let gData = [];

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
    .attr('width', 5)
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
  const dummy = [0.3, 1.4, 0.5, 0.2, 1, 0.3, 1.5, 0.3, 0.7, 0.8, 2]; //TODO, dummy data used for line chart
  const line = d3.line()
    .x(function(d, i) { return lineScaleX(i); })
    .y(function (d) { return lineScaleY(d); });

  const brushContainer = d3.select('.brush-container');

  const brushSvg = brushContainer.append('svg')
    .attr('width', width)
    .attr('height', brushHeight);

  const brush = d3.brushX()
    .extent([[0, 0], [width, brushHeight - 10]])
    .on('end', brushed);

  const bContext = brushSvg.append('g');

  bContext.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, xScale.range());

  bContext.append('path')
    .datum(dummy) //TODO, change for array of entropies
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);
}

function rageData(p1, p2) {
  const nData = filter(gData, function(o) { return (o.pos > p1 && o.pos < p2); });
  return nData;
}

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  const s = d3.event.selection;
  // xScale.domain(s.map(x2.invert, x2)); //por que hay dos valores en map()????
  const newRange = s.map((x2.invert));
  const lower = Math.round(newRange[0]);
  const upper = Math.round(newRange[1]);
  xScale.domain(s.map(x2.invert, x2));
  // xScale.range([upper, lower]);
  const newData = rageData(lower, upper);
  // console.log(xScale(newData[newData.length - 1]));
  // console.log('weird', s.map(x2.invert, x2));

  databind(newData);
  const t = d3.timer((elapsed) => {
    draw(canvas);
    if (elapsed > 600) t.stop();
  });
}

axios.get('api/fasta')
  .then((response) => {
    document.getElementById('root').innerHTML = response.data.length;
    gData = response.data;
    console.log('hello', gData[1]);
    init();
    return axios.get('api/entropy');
  })
  .then((response) => {
    console.log('Response', response);
  });

// axios.get('api/entropy')
//   .then((response) => {
//     console.log(response.data[1]);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
