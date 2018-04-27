import * as d3 from 'd3';
import { filter as _filter } from 'lodash';
import actions from '../../actions/index';
import { getState, dispatch, observe } from '../../store';

const margin = { t: 40, r: 20, b: 20, l: 50 };
let W;
let H;
const scaleX = d3.scaleLinear();
const scaleY = d3.scaleOrdinal();
const aminos = ['A', 'C', 'G', 'T', 'N'];
const rectWidth = 8;
const rectHeight = 25;
const scaleYRange = d3.range(0, rectHeight * 5, rectHeight + 5);
let totalRects;
let filteredData;
const smallPerc = '\uFE6A';

const color = d3.scaleLinear()
  .domain([1, 50, 99])
  .interpolate(d3.interpolateLab)
  .range([d3.rgb('#f3cbd3'), d3.rgb('#6c2167'), d3.rgb('#f3cbd3')]);

const bisectPosition = d3.bisector(d => d.pos).left;

  /**
  * exports() returns a compound alignment chart
  * based on the passed-in d3 selection
  */
  function exportss(node, data, clear) {
    const selection = d3.select(node);
    W = W || selection.node().clientWidth - margin.l - margin.r;
    H = H || selection.node().clientHeight - margin.t - margin.b;
    const alignData = data ? data : [];

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
      .on('mouseover', () => {
        tooltip.style('display', null);
        d3.select('.tooltipFocus').style('display', null);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
        d3.select('.tooltipFocus').style('display', 'none');
      })
      .on('mousemove', (d) => {
        dispatch(actions.alignmentDetail(d.pos));
        mouseMove(d, 'pos');
      });

    if (clear) {
      //changelog
      basepairsEnter.on('mouseover', null);
      basepairsEnter.on('mouseout', null);
      basepairsEnter.on('mousemove', null);
    }

    function mouseMove(d, key) {
      const column = _filter(filteredData, o => o.pos === d[key]);
      scaleX.domain([filteredData[0].pos, filteredData[0].pos + totalRects]);

      tooltip.select('.l-line')
        .attr('transform', `translate(${scaleX(d[key])}, 0)`);

      tooltip.select('.r-line')
        .attr('transform', `translate(${scaleX(d[key] + 1)}, 0)`);

      tooltip.select('.triangle')
        .attr('transform', `translate(${scaleX(d[key])}, -5)`);

      tooltip.selectAll('.t-percent')
        .each(function (e, i) { d3.select(this).text(`${column[i].value}${smallPerc}`); });
    }

    svgEnter.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisAlignment);

    const keyContainer = svgEnter.append('g')
      .attr('class', 'key-container');

    // Color scale key
    const defs = svgEnter.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

    // Horizontal gradient
    linearGradient
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    // start color (0%)
    // linearGradient.append('stop')
    //   .attr('offset', '0%')
    //   .attr('stop-color', '#f3cbd3');

    // // end color (100%)
    // linearGradient.append('stop')
    //   .attr('offset', '100%')
    //   .attr('stop-color', '#6c2167');

    linearGradient.selectAll('stop')
      .data(color.range())
      .enter().append('stop')
      .attr('offset', (d, i) => i / (color.range().length - 1))
      .attr('stop-color', d => d);

    // keyContainer.append('rect')
    //   .attr('width', 250)
    //   .attr('height', 10)
    //   .style('fill', 'url(#linear-gradient)')
    //   .attr('transform', `translate(300, ${-margin.t})`);

    d3.select('#alignment-container').selectAll('line').style('display', 'none');

    // Modifying the position of the Y scale (nucleotides)
    d3.select('#alignment-container').selectAll('text')
      .attr('dy', (rectHeight / 2) + 2)
      .attr('dx', -30);

    // tooltip
    const tooltip = svgEnter.append('g')
      .style('display', 'none')
      .attr('class', 'tooltipAlign');

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
      .attr('y2', (rectHeight * 5) + (5 * 6));

    tooltip.append('line')
      .attr('class', 'r-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('pointer-events', 'none')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', (rectHeight * 5) + (5 * 6));

    tooltip.selectAll('.t-percent')
      .data(aminos)
      .enter().append('text')
      .attr('class', 't-percent')
      .style('fill', 'black')
      .style('opacity', 0.8)
      .attr('text-anchor', 'end')
      .text('-%')
      .attr('transform', d => `translate(${-2}, ${scaleY(d) + (rectHeight / 2) + 4})`);

    let unsubscribeHover;
    setTimeout(() => {
      this.unsubscribeHover = observe(state => state.detailHover, (state, nextState) => {
        mouseMove(state, 'position');
      }, 300);
    });

    this.unsubscribe = observe(state => state.focus, (state, nextSate) => {
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
    if(clear) {
      setTimeout(() => {
        unsubscribeHover(), 400});
      unsubscribe();
    }
  }

const viz = {
  exportss,
  unsubscribe: null,
  unsubscribeHover: null
}

export default viz;