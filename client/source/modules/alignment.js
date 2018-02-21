import * as d3 from 'd3';
import { filter as _filter } from 'lodash';
import actions from '../actions/index';
import { getState, dispatch, observe } from '../store';

function Alignment() {
  const margin = { t: 20, r: 20, b: 20, l: 40 };
  let W;
  let H;
  const scaleX = d3.scaleLinear();
  const scaleY = d3.scaleOrdinal();
  const aminos = ['A', 'C', 'T', 'G', 'N'];
  const rectWidth = 8;
  const rectHeight = 25;
  const scaleYRange = d3.range(0, rectHeight * 5, rectHeight + 5);
  let totalRects;
  let filteredData;

  const color = d3.scaleLinear()
    .domain([1, 50, 99])
    .interpolate(d3.interpolateLab)
    .range([d3.rgb('#f3cbd3'), d3.rgb('#6c2167'), d3.rgb('#f3cbd3')]);

  const bisectPosition = d3.bisector(d => d.pos).left;

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

    dispatch(actions.setRectCount(totalRects));

    // Scales
    scaleX
      .range([0, W])
      .domain([0, totalRects]);

    scaleY
      .domain(aminos)
      .range(scaleYRange);

    // Axes
    const xAxisAlignment = d3.axisBottom(scaleX);
    const yAxisAlignment = d3.axisLeft(scaleY).ticks(2);

    // Bisecting
    function mouseMove() {
      // const newSel = d3.selectAll('.rectangle').filter(function(d) {
      //   console.log(d);
      //   d.pos === x0;
      // });

      // console.log(newSel);

      // if (mouseX > W / 2) {
      //   entropyText.attr('transform', `translate(${scaleX(d.i) - 20}, ${mouseY})`)
      //     .attr('text-anchor', 'end');

      //   posText.attr('transform', `translate(${scaleX(d.i) - 20}, ${mouseY})`)
      //     .attr('text-anchor', 'end');
      // } else {
      //   entropyText.attr('transform', `translate(${scaleX(d.i)}, ${mouseY})`)
      //     .attr('text-anchor', 'start');

      //   posText.attr('transform', `translate(${scaleX(d.i)}, ${mouseY})`)
      //     .attr('text-anchor', 'start');
      // }
    }

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
      .attr('height', rectHeight)
      .attr('y', d => scaleY(d.type))
      .style('pointer-events', 'all')
      .on('mouseover', () => { tooltip.style('display', null); })
      .on('mouseout', () => { tooltip.style('display', 'none'); })
      .on('mousemove', (d) => {
        const column = _filter(filteredData, o => o.pos === d.pos);

        console.log(column);

        tooltip.select('.l-line')
          .attr('transform', `translate(${scaleX(d.pos)}, 0)`);

        tooltip.select('.r-line')
          .attr('transform', `translate(${scaleX(d.pos + 1)}, 0)`);

        tooltip.select('.triangle')
          .attr('transform', `translate(${scaleX(d.pos)}, -5)`);

        tooltip.select('.t-percent')
          .text(column[0].value);
      });

    svgEnter.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisAlignment);

    d3.select('#alignment-container').selectAll('line').style('display', 'none');
    d3.select('#alignment-container').selectAll('text')
      .attr('dy', (rectHeight / 2) + 2)
      .attr('dx', -20);

    // tooltip
    const tooltip = svgEnter.append('g')
      .style('display', 'none');

    tooltip.append('polygon')
      .attr('class', 'triangle')
      .attr('points', '0, -10 10, -10 5, 0');

    tooltip.append('line')
      .attr('class', 'l-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('pointer-events', 'none')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', 130);

    tooltip.append('line')
      .attr('class', 'r-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('pointer-events', 'none')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', 130);

    tooltip.append('text')
      .attr('class', 't-percent')
      .style('fill', 'black')
      .style('opacity', 0.8)
      // .attr('dx', 8)
      // .attr('dy', '-.3em')
      .text('test')
      .attr('transform', `translate(${-20}, ${scaleY('A') + (rectHeight / 2) + 2})`);

    const unsubscribe = observe(state => state.focus, (state, nextSate) => {
      const lower = Math.round(state.range[0]);
      const upper = Math.round(state.range[1]);

      filteredData = _filter(alignData, o => o.pos >= lower && o.pos < upper);

      basepairsEnter.data(filteredData);

      basepairsEnter.transition().duration(10)
      .attr('fill', (d) => {
        if (d.value < color.domain()[0]) {
          return '#f2f2f2';
        } else if (d.value > color.domain()[2]) {
          return '#C0C0C0';
        } return color(d.value);
      });
    });
  }

  return exports;
}

export default Alignment;
