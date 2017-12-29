import axios from 'axios';
import * as d3 from 'd3';
import './style.scss';

console.log(__ENV__);

const width = d3.select('#container').node().getBoundingClientRect().width;
const height = 200;

const canvas = d3.select('#container')
  .append('canvas')
  .attr('width', width)
  .attr('height', height);

const customBase = document.createElement('custom');
const custom = d3.select(customBase);

const aminos = ['A', 'C', 'T', 'G', 'N'];
const yScale = d3.scaleOrdinal()
  .domain(aminos)
  .range([0, 25, 50, 75, 100]);

const xScale = d3.scaleLinear()
  .domain([0, 15383])
  .range([0, width]);

const x2 = d3.scaleLinear()
  .domain([0, 15383])
  .range([0, width]);

const color = d3.scaleLinear()
  .domain([1, 100])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

let gData = [];

function databind(data) {
  const join = custom.selectAll('custom.rect')
    .data(data);

  join.exit().remove();

  join.enter()
    .append('custom')
    .attr('class', 'rect')
    .attr('x', function(d) {
      return xScale(d.pos);
    })
    .attr('y', function(d) {
      return yScale(d.type);
    })
    .attr('width', 20)
    .attr('height', 20)
    .attr('fillStyle', function(d) {
      return color(d.value);
    });
}

function draw(_canvas) {
  const context = _canvas.node().getContext('2d');

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  // context.clearRect(0, 0, width, height);
  const elements = custom.selectAll('custom.rect');
  console.log(elements)

  elements.each(function(d,i) {
    const node = d3.select(this);
    context.fillStyle = node.attr('fillStyle');
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
  });
}

function init() {
  const brushContainer = d3.select('.brush-container');

  const brushSvg = brushContainer.append('svg')
    .attr('width', width)
    .attr('height', 50);

  const brush = d3.brushX()
    .extent([[0, 0], [width, 40]])
    .on('end', brushed);

  const bContext = brushSvg.append('g');

  bContext.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, xScale.range());
}

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  const s = d3.event.selection;
  // xScale.domain(s.map(x2.invert, x2)); //por que hay dos valores en map()????
  const newRange = s.map((x2.invert));
  const upper = Math.round(newRange[0]);
  const lower = Math.round(newRange[1]);
  const newData = gData.slice(upper, lower) // deberiamos agregar +1 en lower ?
  // console.log('reg', s.map(x2));
  // console.log('weird', s.map(x2.invert, x2));

  console.log(newData);

  databind(newData);
  const t = d3.timer((elapsed) => {
    draw(canvas);
    if (elapsed > 1000) t.stop();
  });
}

axios.get('api/fasta')
  .then((response) => {
    document.getElementById('root').innerHTML = response.data.length;
    gData = response.data;
    init();
  })
  .catch((error) => {
    console.log(error);
  });
