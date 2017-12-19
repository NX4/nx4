import axios from 'axios';
import * as d3 from 'd3';
import './style.scss';

console.log(__ENV__);

const width = 750;
const height = 400;

const mainCanvas = d3.select('#container')
.append('canvas')
.classed('mainCanvas', true)
.attr('width', width)
.attr('height', height);

const customBase = document.createElement('custom');
const custom = d3.select(customBase);

const groupSpacing = 4;
const cellSpacing = 2;
const cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;
let data = [];

axios.get('api/fasta')
  .then(function (response) {
    document.getElementById('root').innerHTML = response.data.length;
    data = response.data;
    init();
  })
  .catch(function (error) {
    console.log(error);
  });


function init() {

  databind(data);

  var t = d3.timer(function(elapsed) {
    console.log('timer');
    draw(mainCanvas, false); // <--- new insert arguments
    if (elapsed > 300) t.stop();
  });

}

function databind(data) {
  
        //colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(d3.extent(data, function(d) { return d.value; }));
        
        var join = custom.selectAll('custom.rect')
          .data(data);
  
        var enterSel = join.enter()
          .append('custom')
          .attr('class', 'rect')
          .attr('x', function(d, i) {
            var x0 = Math.floor(i / 100) % 10, x1 = Math.floor(i % 10);
            return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
          })
          .attr('y', function(d, i) {
            var y0 = Math.floor(i / 1000), y1 = Math.floor(i % 100 / 10);
            return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
          })
          .attr('width', 0)
          .attr('height', 0);
  
        join
          .merge(enterSel)
          .transition()
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fillStyle', '#000')
  
        var exitSel = join.exit()
          .transition()
          .attr('width', 0)
          .attr('height', 0)
          .remove();
  
      } // databind()
  
  
      // === Draw canvas === //
  
      function draw(canvas, hidden) { // <---- new arguments
  
        // build context
        var context = canvas.node().getContext('2d');
  
  
        // clear canvas
        context.clearRect(0, 0, width, height);
  
        
        // draw each individual custom element with their properties
        
        var elements = custom.selectAll('custom.rect') // this is the same as the join variable, but used here to draw
        
        elements.each(function(d,i) { // for each virtual/custom element...
  
          var node = d3.select(this);
  
          context.fillStyle = node.attr('fillStyle'); // <--- new: node colour depends on the canvas we draw 
          context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
  
        });
  
      } // draw()

