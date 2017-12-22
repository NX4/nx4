import axios from 'axios';
import * as d3 from 'd3';
import './style.scss';

console.log(__ENV__);

const width = 30000;
const height = 200;

const mainCanvas = d3.select('#container')
.append('canvas')
.classed('mainCanvas', true)
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
  .range([0, 400000]);

const color = d3.scaleLinear()
  .domain([1, 100])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#e6e6e6'), d3.rgb('#000')]);

const groupSpacing = 4;
const cellSpacing = 2;
const cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;
let data = [];

axios.get('api/fasta')
  .then((response) => {
    document.getElementById('root').innerHTML = response.data.length;
    data = response.data;
    init();
  })
  .catch((error) => {
    console.log(error);
  });

function databind(data) {

  const join = custom.selectAll('custom.rect')
    .data(data);

  const enterSel = join.enter()
    .append('custom')
    .attr('class', 'rect')
    .attr('x', function(d) {
      return xScale(d.pos);
    })
    .attr('y', function(d) {
      return yScale(d.type);
    })
    .attr('width', 0)
    .attr('height', 0);

  join
    .merge(enterSel)
    .transition()
    .attr('width', 20)
    .attr('height', 20)
    .attr('fillStyle', function(d) {
      return color(d.value);
    });

  const exitSel = join.exit()
    .transition()
    .attr('width', 0)
    .attr('height', 0)
    .remove();
}

function draw(canvas, hidden) {
  const context = canvas.node().getContext('2d');
  context.clearRect(0, 0, width, height);
  const elements = custom.selectAll('custom.rect')

  elements.each(function(d,i) {
    const node = d3.select(this);
    context.fillStyle = node.attr('fillStyle');
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
  });
}

function init() {
  databind(data);

  const t = d3.timer((elapsed) => {
    draw(mainCanvas, false);
    if (elapsed > 700) t.stop();
  });
}
