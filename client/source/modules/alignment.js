import * as d3 from 'd3';
import actions from '../actions/index';
import { getState, dispatch } from '../store';

function Alignment() {
  const margin = { t: 20, r: 20, b: 20, l: 20 };
  let W;
  let H;
  const scaleX = d3.scaleLinear();
  const scaleY = d3.scaleOrdinal();
  const aminos = ['A', 'C', 'T', 'G', 'N'];
  const rectWidth = 10;
  let totalRects;
  let scaleXDomain;

  const color = d3.scaleLinear()
    .domain([1, 50, 99])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb('#f3cbd3'), d3.rgb('#6c2167'), d3.rgb('#f3cbd3')]);

  /**
  * exports() returns a compound alignment chart
  * based on the passed-in d3 selection
  */
  function exports(selection) {
    W = W || selection.node().clientWidth - margin.l - margin.r;
    H = H || selection.node().clientHeight - margin.t - margin.b;
    const alignData = selection.datum() ? selection.datum() : [];

    // calculate width
    totalRects = Math.floor(W / rectWidth);
    scaleXDomain = Math.floor(alignData.length / aminos.length);

    console.log(totalRects);

    // Scales
    scaleX
      .range([0, W])
      .domain([0, totalRects]);

    scaleY
      .domain(aminos)
      .range([0, 25, 50, 75, 100]);

    // Axes
    const xAxisContext = d3.axisBottom(scaleX);
    const yAxisContext = d3.axisLeft(scaleY).ticks(2);

    // SVG initializer
    const svg = selection.selectAll('svg')
      .data([0]);

    const svgEnter = svg.enter()
      .append('svg')
      .attr('width', W + margin.l + margin.r)
      .attr('height', H + margin.t + margin.b)
      .merge(svg)
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const basepairs = svgEnter.selectAll('rect')
      .data(alignData.slice(0, totalRects * 5));

    const basepairsEnter = basepairs.enter().append('rect')
      .attr('class', 'rectangle')
      .attr('x', d => scaleX(d.pos))
      .attr('width', rectWidth)
      .attr('height', rectWidth)
      .attr('y', function (d) {
        return scaleY(d.type);
      })
      .attr('fill', (d) => {
        if (d.value < color.domain()[0] || d.value > color.domain()[2]) {
          return '#E0E0E0';
        } return color(d.value);
      })
      .on('mouseover', d => console.log(d));

    d3.select('body').on('click', function (d) {
      console.log('click', basepairsEnter);
      basepairsEnter.data(alignData.slice(139, 829));

      basepairsEnter.transition().duration(500)
      .attr('fill', (d) => {
        if (d.value < color.domain()[0] || d.value > color.domain()[2]) {
          return '#E0E0E0';
        } return color(d.value);
      });
    });

    // context.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', `translate(0, ${H})`)
    //   .call(xAxisContext);

    // context.append('g')
    //   .attr('class', 'axis axis--y')
    //   .call(yAxisContext);


    // Interactive functions


      // Reducer
      // dispatch(actions.updateRecs(newRange, domain));
  } // exports()

  return exports;
} // Context()

export default Alignment;
